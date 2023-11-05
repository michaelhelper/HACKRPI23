
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

function createHospitalElement(hospital) {
    const hospitalElement = document.createElement("div");
    hospitalElement.classList.add("hospital");

    const nameElement = document.createElement("p");
    nameElement.classList.add("hospital-name");
    nameElement.textContent = hospital.name;

    const infoElement = document.createElement("p");
    infoElement.classList.add("hospital-info");

    const traumalvl = hospital.traumalvl;
    var traumalvl_rate;
    if (traumalvl >= 4){
        traumalvl_rate = "Low"
    }
    else if (traumalvl > 2){
        traumalvl_rate = "Medium"
    }
    else{
        traumalvl_rate = "High"
    }
    
    const peds = hospital.peds;
    var peds_rate = peds ? "Yes" : "No";

    const perinatal = hospital.perinatal;
    var perinatal_rate = perinatal ? "Yes" : "No";

    const PCI = hospital.PCI;
    var PCI_rate = PCI ? "Yes" : "No";

    const stroke = hospital.stroke;
    var stroke_rate = stroke

    infoElement.innerHTML = `<span id="bold">Trauma Level:</span>&nbsp;${traumalvl_rate} |&nbsp;<span id="bold">Pediatric:</span>&nbsp;${peds_rate} |&nbsp;<span id="bold">Stroke:</span>&nbsp;${stroke_rate} |&nbsp;<span id="bold">Birth:</span>&nbsp;${perinatal_rate} |&nbsp;<span id="bold">Artery Care:</span>&nbsp;${PCI_rate} |&nbsp;<span id="bold">Burns:</span>&nbsp;${hospital.burn} `;
    // |&nbsp;<span id="bold">Pediatric</span> ${hospital.peds} | <span id="bold">Stroke:</span> ${hospital.stroke} | <span id="bold">Stroke:</span> ${hospital.stroke} | <span id="bold">Birth:</span> ${hospital.perinatal} | <span id="bold">Artery Care:</span> ${hospital.PCI} | <span id="bold">Burns:</span> ${hospital.burn} `;

    hospitalElement.appendChild(nameElement);
    hospitalElement.appendChild(infoElement);

    return hospitalElement;
}




window.onload = function() {
    // Create map
    const map = L.map('map').setView([47.7291949, -73.6795041], 11);
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
    fetch(facilityList)
        .then(response => response.json())
        .then(data => {
            data.hospitals.forEach(facility => {
                const marker = L.marker([facility.coords.x, facility.coords.y], {icon: new hospIcon()}).addTo(map);
                marker.bindPopup(`<b>${facility.name}</b><br>${facility.address}<br>`);
                // Get distance from user's location to each hospital
                const userLocation = map.getCenter();
                const facilityLocation = marker.getLatLng();
                const distance = userLocation.distanceTo(facilityLocation);
                // Add each hospital to the allHospitals array
                allHospitals.push({ name: facility.name, token: facility.token, distance: distance, coords: facility.coords, traumalvl: facility.traumalvl, peds: facility.peds, perinatal: facility.perinatal, PCI: facility.PCI, stroke: facility.stroke, burn: facility.burn });
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
                let userLocation = map.getCenter();
            
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
                        const drivingTime = result.routes[0].legs[0].duration.text;
                        console.log(`It will take ${drivingTime} to drive from ${userLocation} to ${hospitalName}.`);
                        // add the driving time to the hospital object
                        closestHospitals[counter].drivingTime = drivingTime;
						fetch("./API/getWaittime.php?hosp="+hospitalToken).then(x => x.text()).then((txt) => {
							console.log(`There will be a ${txt} wait at ${hospitalName}.`);
                            // add the wait time to the hospital object
                            // wait time looks like this: {"wait": "0h 46m"}
                            let waitTime = JSON.parse(txt);
                            console.log(waitTime["wait"]);
                            closestHospitals[counter].waitTime = waitTime["wait"];
						})
                    }
                });
                const hospitalList = document.getElementById('hospital-list');
                // wait 10 ms before making the next request
                setTimeout(function() {}, 10);
                // add a new element total wait time to the hospital object
                // wait time looks like this: {"wait": "0h 46m"}
                // driving time looks like this: drivingTime: "5 hours 36 mins"
                // total time looks like this: "6 hours 22 mins"    
                let waitTime = closestHospitals[counter].waitTime;
                let drivingTime = closestHospitals[counter].drivingTime;
                console.log(closestHospitals[counter]);
                cons
                console.log(drivingTime);
                console.log(waitTime);
                let waitTimeHours = parseInt(waitTime.substring(0, 1));
                let waitTimeMinutes = parseInt(waitTime.substring(3, 5));
                let drivingTimeHours = parseInt(drivingTime.substring(0, 1));
                let drivingTimeMinutes = parseInt(drivingTime.substring(8, 10));
                let totalTimeHours = waitTimeHours + drivingTimeHours;
                let totalTimeMinutes = waitTimeMinutes + drivingTimeMinutes;
                if (totalTimeMinutes >= 60) {
                    totalTimeHours = totalTimeHours + 1;
                    totalTimeMinutes = totalTimeMinutes - 60;
                }
                let totalTime = totalTimeHours + " hours " + totalTimeMinutes + " mins";
                facility.totalTime = totalTime;
                console.log(facility)
                //sort the allHospitals array by total wait time
                // allHospitals.sort(function(a, b) {
                //     return a.totalTime - b.totalTime;
                // });
                // Add each hospital to the hospital-list
                const hospitalElement = createHospitalElement(facility);
                hospitalList.appendChild(hospitalElement);
            });
            counter = counter + 1;
        });
}
