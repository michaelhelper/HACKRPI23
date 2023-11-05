let User_lat = 0;
let User_lng = 0;
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

function createHospitalElement(hospital) {
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

    const infoElement = document.createElement("p");
    infoElement.classList.add("hospital-info");

    const traumalvl = hospital.traumalvl;
    var traumalvl_rate;
    if (traumalvl >= 4){
        traumalvl_rate = "This hospital cannot handle serious injuries"
    }
    else if (traumalvl == 3){
        traumalvl_rate = "3 - This hospital can stabilize serious injuries"
    }
    else if (traumalvl == 2){
        traumalvl_rate = "2 - This hospital can handle most serious injuries"
    }
    else{
        traumalvl_rate = "1 - Gold standard in injury care, can handle all injuries"
    }
    
    const peds = hospital.peds;
    var peds_rate = peds ? "This hospital has children specialists" : "";

    const perinatal = hospital.perinatal;
    var perinatal_rate = perinatal ? "This hospital can deal with birth and newborn complications" : "";

    const PCI = hospital.PCI;
    var PCI_rate = PCI ? "This hospital can handle heart attacks and heart problems" : "This hospital cannot handle heart attacks and heart problems";

    const stroke = hospital.stroke;
    var stroke_rate;
    if (stroke == "none"){
        stroke_rate = "This hospital cannot handle strokes"
    }
    else if (stroke == "primary"){
        stroke_rate = "This hospital can stabilize strokes"
    }
    else if (stroke == "comprehensive"){
        stroke_rate = "This hospital can treat strokes"
    }

    var driveTime = hospital.drivingTime;
    var waitTime = hospital.waitTime;


    infoElement.innerHTML += `<p><b>Trauma Level:</b>&nbsp;${traumalvl_rate}</p>`
    if(peds_rate != ""){
        infoElement.innerHTML += `<p><b>Pediatric:</b>&nbsp;${peds_rate}</p>`
    }
    infoElement.innerHTML += `<p><b>Stroke:</b>&nbsp;${stroke_rate}</p>`
    if(perinatal_rate != ""){
        infoElement.innerHTML += `<p><b>Birth:</b>&nbsp;${perinatal_rate}</p>`
    }
    infoElement.innerHTML += `<p><b>Cardiac Center:</b>&nbsp;${PCI_rate}</p>`
    infoElement.innerHTML += `<p><b>Drive Time:</b>&nbsp;${driveTime}<br><b>Wait Time:</b>&nbsp;${waitTime}</p>`;

    infoElement.innerHTMl += `<button id="get-directions">Get Directions</button>`
    hospitalElement.onclick = function() {
        toggleHospital(infoElement);
    }

    hospitalElement.appendChild(hospitalMain);
    hospitalElement.appendChild(infoElement);

    
    return hospitalElement;
}




window.onload = function() {
    // Create map
    const map = L.map('map').setView([42.734253, -73.672481], 11);
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    // Initialize allHospitals array
    const allHospitals = [];

    // Get current location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            User_lat = lat;
            User_lng = lng;
            // Set the map view to the lat/long
            map.setView([lat, lng], 11);
			let userIcon = L.Icon.extend({
				options: {
					iconUrl: "./resources/images/person.png",
					iconSize: [48,48],
					popupAnchor:  [0, 0]
				}
			});
			const marker = L.marker([lat, lng], {icon: new userIcon()}).addTo(map);
            // Make the input field 2.5 times wider and replace the temp text with "Enter response here"
            const searchInput = document.getElementById('search-input');
            searchInput.placeholder = 'Enter response here';
        });
    }


    // Get location from zip code

    const apiKey = 'AIzaSyA3Jn3hJdL2dFsXI8MkE9FWK8rj4jWMae0'; // Replace with your Google Maps API key

    // Function to convert ZIP code to lat/long
    function convertZipCode(l1, l2) {
        // Get the ZIP code from the form
        const zipCode = document.getElementById('search-input').value;
        const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${zipCode}&key=${apiKey}`;
        // Query the API using fetch()
        fetch(geocodingUrl)
            .then(response => response.json())
            .then(data => {
                const lat = data.results[0].geometry.location.lat;
                const lng = data.results[0].geometry.location.lng;
                User_lat = lat;
                User_lng = lng;
                // Set the map view to the lat/long
                map.setView([lat, lng], 11);
                alert(`The latitude is ${lat} and the longitude is ${lng}`);
            });
    }

    // Attach the function to the button's click event
    const convertButton = document.getElementById('search-button');
    let l1 = 3.0;
    let l2 = 4.0;
    convertButton.addEventListener('click', async () => {
      try {
        await convertZipCode(l1,l2);
        console.log(`The latitude is ${l1} and the longitude is ${l2}`);
        // You can save location.lat and location.lng to a variable or perform other actions here.

      } catch (error) {
        console.error('An error occurred:', error);
      }
    });

    // Run through all hospitals in the facility list .json file and add them to the map
    const facilityList = './facilitydata.json';
    let closestHospitals = [];
	let hospIcon = L.Icon.extend({
		options: {
			iconUrl: "./resources/images/hospital.png",
			iconSize: [48,48],
			popupAnchor:  [0, 0]
		}
	});
    let counter = 0;
    let newFinalArray = [];
    fetch(facilityList)
        .then(response => response.json())
        .then(data => {
            data.hospitals.forEach(facility => {
                const marker = L.marker([facility.coords.x, facility.coords.y], {icon: new hospIcon()}).addTo(map);
                marker.bindPopup(`<b>${facility.name}</b><br>${facility.address}<br>`);
                // Get distance from user's location to each hospital
                let userLocation = goo``
                const facilityLocation = marker.getLatLng();
                const distance = userLocation.distanceTo(facilityLocation);
                // Add each hospital to the allHospitals array
                allHospitals.push({ name: facility.name, token: facility.token, distance: distance, coords: facility.coords, traumalvl: facility.traumalvl, peds: facility.peds, perinatal: facility.perinatal, PCI: facility.PCI, stroke: facility.stroke, burn: facility.burn});
            });
            // Sort the allHospitals array by distance
            allHospitals.sort(function(a, b) {
                return a.distance - b.distance;
            });
            for (let i = 0; i < 5; i++) {
                closestHospitals.push(allHospitals[i]);
            }
            // Concatenate the names of the 5 closest hospitals
            const closestHospitalNames = allHospitals.slice(0, 5).map(hospital => hospital.name).join(', ');
            console.log(`The 5 closest hospitals are: ${closestHospitalNames}.`);
            console.log(closestHospitals);
            
            // Create a DirectionsService object to use the Directions API
            let directionsService = new google.maps.DirectionsService();
            closestHospitals.forEach(facility => {
                let hospitalName = facility.name;
				let hospitalToken = facility.token;
                let hospitalCoords = facility.coords;
                let hospitalLocation = new google.maps.LatLng(hospitalCoords.x, hospitalCoords.y);
                // let userLocation = map.getCenter();
                let userLocation = new google.maps.LatLng(User_lat, User_lng);
            
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
                        console.log(`It will take ${drivingTime} to drive from ${userLocation} to ${hospitalName}.`);
                        // add the driving time to the hospital object
                        // closestHospitals[counter].drivingTime = drivingTime;
						fetch("./API/getWaittime.php?hosp="+hospitalToken).then(x => x.text()).then((txt) => {
							console.log(`There will be a ${txt} wait at ${hospitalName}.`);
                            // add the wait time to the hospital object
                            // wait time looks like this: {"wait": "0h 46m"}
                            let waitTime = JSON.parse(txt);
                            console.log(waitTime["wait"]);
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
                            newFinalArray.push({name: hospitalName, token: hospitalToken, coords: hospitalCoords, traumalvl: facility.traumalvl, peds: facility.peds, perinatal: facility.perinatal, PCI: facility.PCI, stroke: facility.stroke, burn: facility.burn, drivingTime: drivingTime, waitTime: waitTime["wait"], totalTime: totalTimeHours + " hours " + totalTimeMinutes + " mins"});
                            console.log(newFinalArray[counter]);
                            const hospitalElement = createHospitalElement({name: hospitalName, token: hospitalToken, coords: hospitalCoords, traumalvl: facility.traumalvl, peds: facility.peds, perinatal: facility.perinatal, PCI: facility.PCI, stroke: facility.stroke, burn: facility.burn, drivingTime: drivingTime, waitTime: waitTime["wait"], totalTime: totalTimeHours + " hours " + totalTimeMinutes + " mins"});
                            hospitalList.appendChild(hospitalElement);
						})
                    }
                });
                const hospitalList = document.getElementById('hospital-list');
                // wait 10 ms before making the next request
                setTimeout(function() {}, 10);
                // add a new element total wait time to the hospital object
                // // wait time looks like this: {"wait": "0h 46m"}
                // // driving time looks like this: drivingTime: "5 hours 36 mins"
                // // total time looks like this: "6 hours 22 mins"    
                // let waitTime = closestHospitals[counter].waitTime;
                // let drivingTime = closestHospitals[counter].drivingTime;
                // console.log(closestHospitals[counter]);
                // console.log(closestHospitals[counter].drivingTime);
                // console.log(drivingTime);
                // console.log(waitTime);
                // let waitTimeHours = parseInt(waitTime.substring(0, 1));
                // let waitTimeMinutes = parseInt(waitTime.substring(3, 5));
                // let drivingTimeHours = parseInt(drivingTime.substring(0, 1));
                // let drivingTimeMinutes = parseInt(drivingTime.substring(8, 10));
                // let totalTimeHours = waitTimeHours + drivingTimeHours;
                // let totalTimeMinutes = waitTimeMinutes + drivingTimeMinutes;
                // if (totalTimeMinutes >= 60) {
                //     totalTimeHours = totalTimeHours + 1;
                //     totalTimeMinutes = totalTimeMinutes - 60;
                // }
                // let totalTime = totalTimeHours + " hours " + totalTimeMinutes + " mins";
                // closestHospitals[counter].totalTime = totalTime;
                // console.log(totalTime);
                //sort the allHospitals array by total wait time
                // allHospitals.sort(function(a, b) {
                //     return a.totalTime - b.totalTime;
                // });
                // Add each hospital to the hospital-list

                
            });
            counter = counter + 1;
        });
}
