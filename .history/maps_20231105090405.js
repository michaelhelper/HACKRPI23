let user_lat = 42.729219;
let user_lng = -73.6794773;
let theMap;
let marker;
let newFinalArray = [];


// Function to convert ZIP code to lat/long
function convertZipCode() {
    // Get the ZIP code from the form
    const apiKey = 'AIzaSyA3Jn3hJdL2dFsXI8MkE9FWK8rj4jWMae0';
    const zipCode = document.getElementById('search-input').value;
    const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${zipCode}&key=${apiKey}`;
    // Query the API using fetch()
    fetch(geocodingUrl)
        .then(response => response.json())
        .then(data => {
            const lat = data.results[0].geometry.location.lat;
            const lng = data.results[0].geometry.location.lng;
            // Set the map view to the lat/long
            theMap.setView([lat, lng], 11);
            user_lat = lat;
            user_lng = lng;
            // Create a marker at the lat/long
            let userIcon = L.Icon.extend({
                options: {
                    iconUrl: "./resources/images/person.png",
                    iconSize: [48,48],
                    popupAnchor:  [0, 0]
                }
            });
            marker = L.marker([lat, lng], {icon: new userIcon()}).addTo(theMap);
            allcodes(theMap);
        });
}
// Calculate the distance between two sets of coordinates using the Haversine formula.
function calculateDistance(lat1, lng1, lat2, lng2) {
    const radius = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLng = (lng2 - lng1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = radius * c;
    return distance;
}

// Hide or show the hospital based on toggle
function toggleHospital(element){
    // Go through all hospitals and hide them
    const hospitals = document.getElementsByClassName("hospital-info");
    for (let i = 0; i < hospitals.length; i++) {
        hospitals[i].style.display = "none";
    }

    // fade in the hospital that was clicked
    element.style.display = "block";
    element.style.opacity = 0;
    (function fade() {
        var val = parseFloat(element.style.opacity);
        if (!((val += .1) > 1)) {
            element.style.opacity = val;
            requestAnimationFrame(fade);
        }
    })();
}

function createHospitalElement(hospital, map) {
    const hospitals = document.getElementsByClassName("hospital");
    if (hospitals.length > 4) {
        console.log(hospitals[0]);
        hospitals[0].remove();
    }

    const hospitalElement = document.createElement("div");
    hospitalElement.classList.add("hospital");
    // add an onlick event that calls toggleHospital

    const hospitalMain = document.createElement("div");
    hospitalMain.classList.add("hospital-main");

    const nameElement = document.createElement("p");
    nameElement.classList.add("hospital-name");
    nameElement.textContent = hospital.name;
   // console.log(hospital.name)
    const timeElement = document.createElement("p");
    timeElement.classList.add("hospital-time");
    timeElement.textContent = hospital.totalTime;

    hospitalMain.appendChild(nameElement);
    hospitalMain.appendChild(timeElement);

    const infoElement = document.createElement("div");
    infoElement.classList.add("hospital-info");

    const traumalvl = hospital.traumalvl;
    var traumalvl_rate;
    if (traumalvl >= 4){
        traumalvl_rate = "This hospital cannot handle serious injuries."
    }
    else if (traumalvl == 3){
        traumalvl_rate = "3 - This hospital can stabilize serious injuries."
    }
    else if (traumalvl == 2){
        traumalvl_rate = "2 - This hospital can handle most serious injuries."
    }
    else{
        traumalvl_rate = "1 - Gold standard in injury care, can handle all injuries."
    }
    
    const peds = hospital.peds;
    var peds_rate = peds ? "This hospital has a pediatric ER." : "";

    const perinatal = hospital.perinatal;
    var perinatal_rate = perinatal ? "This hospital can deal with birth and newborn complications." : "";

    const PCI = hospital.PCI;
    var PCI_rate = PCI ? "This hospital can handle heart attacks and heart problems." : "This hospital cannot handle heart attacks and heart problems.";

    const stroke = hospital.stroke;
    var stroke_rate;
    if (stroke == "none"){
        stroke_rate = "This hospital cannot handle strokes."
    }
    else if (stroke == "primary"){
        stroke_rate = "This hospital can treat mild strokes."
    }
    else if (stroke == "comprehensive"){
        stroke_rate = "This hospital can treat all strokes."
    }

    var driveTime = hospital.drivingTime;
    var waitTime = hospital.waitTime;

    infoElement.innerHTML += `<p><b>Trauma:</b>&nbsp;${traumalvl_rate}</p>`;
    if(peds_rate != ""){
        infoElement.innerHTML += `<p><b>Pediatric:</b>&nbsp;${peds_rate}</p>`;
    }
    infoElement.innerHTML += `<p><b>Stroke:</b>&nbsp;${stroke_rate}</p>`;
    if(perinatal_rate != ""){
        infoElement.innerHTML += `<p><b>Birth:</b>&nbsp;${perinatal_rate}</p>`;
    }
    infoElement.innerHTML += `<p><b>Cardiac:</b>&nbsp;${PCI_rate}</p>`;
    infoElement.innerHTML += `<div id="drive"><div id="drive-time"><p><b>Drive Time:</b>&nbsp;${driveTime}<br><b>Wait Time:</b>&nbsp;${waitTime}</p></div><div id="get-direction"><a target="_blank"href="https://www.google.com/maps/place/${hospital.address.replace(' ',',').replace(' ','+')}" target="_blank"><button>Go</button></a></div></div>`;

    hospitalElement.onclick = function() {
        toggleHospital(infoElement);
		map.flyTo([hospital.x, hospital.y]);
        // open the popup for the hospital
        var popup = L.popup()
            .setLatLng([hospital.x, hospital.y])
            .setContent(`<b>${hospital.name}</b><br>${hospital.address}<br>`)
            .openOn(map);
    }

    hospitalElement.appendChild(hospitalMain);
    hospitalElement.appendChild(infoElement);

    return hospitalElement;
}

function allcodes(map){

    const apiKey = 'AIzaSyA3Jn3hJdL2dFsXI8MkE9FWK8rj4jWMae0';
    
    // Initialize allHospitals array
    const allHospitals = [];
    // Create map
    // const map = L.map('map').setView([47.7291949, -73.6795041], 11);
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    // Get location from zip code

    // Attach the function to the button's click event
    // const convertButton = document.getElementById('search-button');
    // let l1 = 3.0;
    // let l2 = 4.0;
    // convertButton.addEventListener('click', async () => {
    //   try {
    //     await convertZipCode(l1,l2);
    //     console.log(`The latitude is ${l1} and the longitude is ${l2}`);
    //     // You can save location.lat and location.lng to a variable or perform other actions here.

    //   } catch (error) {
    //     console.error('An error occurred:', error);
    //   }
    // });

    // Run through all hospitals in the facility list .json file and add them to the map
    const facilityList = 'https://raw.githubusercontent.com/tfinnm/HospitalData/main/facilitydata.json';
    let closestHospitals = [];
	let hospIcon = L.Icon.extend({
		options: {
			iconUrl: "./resources/images/hospital.png",
			iconSize: [48,48],
			popupAnchor:  [0, 0]
		}
	});
    let counter = 0;

    fetch(facilityList)
        .then(response => response.json())
        .then(data => {
            data.hospitals.forEach(facility => {
                marker = L.marker([facility.coords.x, facility.coords.y], {icon: new hospIcon()}).addTo(map);
                marker.bindPopup(`<b>${facility.name}</b><br>${facility.address}<br>`);
                // Get distance from user's location to each hospital
                const userLocation = map.getCenter();
                const facilityLocation = marker.getLatLng();
                const distance = userLocation.distanceTo(facilityLocation);
                // Add each hospital to the allHospitals array
                allHospitals.push({ name: facility.name, token: facility.token, distance: distance, coords: facility.coords, traumalvl: facility.traumalvl, peds: facility.peds, perinatal: facility.perinatal, PCI: facility.PCI, stroke: facility.stroke, burn: facility, address: facility.address});
            });
            // Sort the allHospitals array by distance
            allHospitals.sort(function(a, b) {
                return a.distance - b.distance;
            });
            for (let i = 0; i < 5; i++) {
                closestHospitals.push(allHospitals[i]);
            }
            
            // Create a DirectionsService object to use the Directions API
            let directionsService = new google.maps.DirectionsService();
            closestHospitals.forEach(facility => {
                let hospitalName = facility.name;
				let hospitalToken = facility.token;
                let hospitalCoords = facility.coords;
                let hospitalLocation = new google.maps.LatLng(hospitalCoords.x, hospitalCoords.y);
                
                let userLocation = map.getCenter();
                // use the user's location instead of the map center with thw same format as hospitalLocation
                // let userLocation = new google.maps.LatLng(user_lat, user_lng);

            
                // Create a DirectionsRequest object
                let request = {
                    origin: userLocation,
                    destination: hospitalLocation,
                    travelMode: 'DRIVING'
                };
            
                // Make a directions request
                directionsService.route(request, function(result, status) {
                    if (status == 'OK') {
                        // Get the driving time from the result
                        let drivingTime = result.routes[0].legs[0].duration.text;
                        // add the driving time to the hospital object
                        // closestHospitals[counter].drivingTime = drivingTime;
						fetch("./API/getWaittime.php?hosp="+hospitalToken).then(x => x.text()).then((txt) => {
							console.log(`There will be a ${txt} wait at ${hospitalName}.`);
                            // add the wait time to the hospital object
                            // wait time looks like this: {"wait": "0h 46m"}
                            let waitTime = JSON.parse(txt);
                            // closestHospitals[counter].waitTime = waitTime["wait"];
                            // Calculate the total time
                            // check if the driving time is in hours and minutes or just minutes
                            let totalTimeHours;
                            let totalTimeMinutes;
                            if (drivingTime.includes("hours")) {
                                let drivingTimeHours = parseInt(drivingTime.substring(0, 1));
                                let drivingTimeMinutes = parseInt(drivingTime.substring(8, 10));
                                let waitTimeHours = parseInt(waitTime["wait"].substring(0, 1));
                                let waitTimeMinutes = parseInt(waitTime["wait"].substring(3, 5));
                                totalTimeHours = waitTimeHours + drivingTimeHours;
                                totalTimeMinutes = waitTimeMinutes + drivingTimeMinutes;
                                if (totalTimeMinutes >= 60) {
                                    totalTimeHours = totalTimeHours + 1;
                                    totalTimeMinutes = totalTimeMinutes - 60;
                                }
                            }
                            else {
                                let drivingTimeMinutes = parseInt(drivingTime.substring(0, 2));
                                let waitTimeHours = parseInt(waitTime["wait"].substring(0, 1));
                                let waitTimeMinutes = parseInt(waitTime["wait"].substring(3, 5));
                                totalTimeHours = waitTimeHours;
                                totalTimeMinutes = waitTimeMinutes + drivingTimeMinutes;
                                if (totalTimeMinutes >= 60) {
                                    totalTimeHours = totalTimeHours + 1;
                                    totalTimeMinutes = totalTimeMinutes - 60;
                                }
                            }
                            // let hospitalList = document.getElementById('hospital-list');
                            newFinalArray.push({name: facility.name, token: hospitalToken, coords: hospitalCoords, traumalvl: facility.traumalvl, peds: facility.peds, perinatal: facility.perinatal, PCI: facility.PCI, stroke: facility.stroke, burn: facility.burn, drivingTime: drivingTime, waitTime: waitTime["wait"], totalTime: totalTimeHours + " hours " + totalTimeMinutes + " mins", address: facility.address, totalWaitInMinutes: (totalTimeHours * 60) + totalTimeMinutes});
                            // const hospitalElement = createHospitalElement({name: hospitalName, token: hospitalToken, coords: hospitalCoords, traumalvl: facility.traumalvl, peds: facility.peds, perinatal: facility.perinatal, PCI: facility.PCI, stroke: facility.stroke, burn: facility.burn, drivingTime: drivingTime, waitTime: waitTime["wait"], totalTime: totalTimeHours + " hours " + totalTimeMinutes + " mins", address: facility.address, x: facility.coords.x, y: facility.coords.y}, map);
                            // hospitalList.appendChild(hospitalElement);
						})
                    }
                });
                
                // wait 10 ms before making the next request
                // setTimeout(function() {}, 10);
            });
            counter = counter + 1;
        });
    console.log(newFinalArray);
    // wait until the array is filled without using a timeout
    // sort the array by total time
    newFinalArray.sort(function(a, b) {
        return a.totalWaitInMinutes - b.totalWaitInMinutes;
    });
    for (let i = 0; i < 5; i++) {
        let hospitalList = document.getElementById('hospital-list');
        const hospitalElement = createHospitalElement(newFinalArray[i], map);
        hospitalList.appendChild(hospitalElement);
    }
}



// run after the page loads
// 
function() initMap {
    theMap = L.map('map').setView([user_lat, user_lng], 11);
    // Get current location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            user_lat = lat;
            user_lng = lng;
            // Set the map view to the lat/long
            theMap.setView([lat, lng], 11);
			let userIcon = L.Icon.extend({
				options: {
					iconUrl: "./resources/images/person.png",
					iconSize: [48,48],
					popupAnchor:  [0, 0]
				}
			});
			marker = L.marker([user_lat, user_lng], {icon: new userIcon()}).addTo(theMap);
            
            //call allcodes
            allcodes(theMap);
            // Make the input field 2.5 times wider and replace the temp text with "Enter response here"
            const searchInput = document.getElementById('search-input');
            searchInput.placeholder = 'Enter response here';
        });
    }
    // wait 10 ms before making the next request
    setTimeout(function() {}, 100);
    //call allcodes
    allcodes(theMap);
}

function clickPress(event) {
    if (event.keyCode == 13) {
        zipcode(theMap);
    }
}

function zipcode() {
    // Get the ZIP code from the form
    // const zipCode = document.getElementById('search-input').value;
    // alert(`The zip code is ${zipCode}`);
    convertZipCode();
}