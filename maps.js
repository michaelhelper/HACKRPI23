
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
    var stroke_rate = stroke ? "Yes" : "No";

    infoElement.innerHTML = `<span id="bold">Trauma Level:</span>&nbsp;${traumalvl_rate} | <span id="bold">Pediatric:</span>&nbsp;${peds_rate} | <span id="bold">Stroke:</span>&nbsp;${stroke_rate} | <span id="bold">Birth:</span>&nbsp;${perinatal_rate} | <span id="bold">Artery Care:</span>&nbsp;${PCI_rate} | <span id="bold">Burns:</span>&nbsp;${hospital.burn} `;
    // | <span id="bold">Pediatric</span> ${hospital.peds} | <span id="bold">Stroke:</span> ${hospital.stroke} | <span id="bold">Stroke:</span> ${hospital.stroke} | <span id="bold">Birth:</span> ${hospital.perinatal} | <span id="bold">Artery Care:</span> ${hospital.PCI} | <span id="bold">Burns:</span> ${hospital.burn} `;

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

            // Make the input field 2.5 times wider and replace the temp text with "Enter response here"
            const searchInput = document.getElementById('search-input');
            searchInput.style.width = '250%';
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
    fetch(facilityList)

        .then(response => response.json())
        .then(data => {
            data.hospitals.forEach(facility => {
                const marker = L.marker([facility.coords.x, facility.coords.y]).addTo(map);
                marker.bindPopup(`<b>${facility.name}</b><br>${facility.address}<br>`);
                // Get distance from user's location to each hospital
                const userLocation = map.getCenter();
                const facilityLocation = marker.getLatLng();
                const distance = userLocation.distanceTo(facilityLocation);
                // Add each hospital to the allHospitals array
                allHospitals.push({ name: facility.name, distance: distance, coords: facility.coords });
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


            // Add the 5 closest hospitals to the closestHospitals array
            // use another meathod
            console.log(`The 5 closest hospitals are: ${closestHospitalNames}.`);
            console.log(closestHospitals);
            closestHospitals.forEach(facility => {
                // console log the driving time between the user's location and each hospital after calling the Google Distance Matrix API
                let hospitalName = facility.name;
                let hospitalCoords = facility.coords;
                let hospitalLocation = `${hospitalCoords.x},${hospitalCoords.y}`;
                let userLocation = map.getCenter();
                let userCoords = userLocation.toString();
                let userLocationString = userCoords.replace('LatLng(', '').replace(')', '');
                // use distance matrix service instead
                let distanceMatrixUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${userLocationString}&destinations=${hospitalLocation}&mode=driving&key=${apiKey}`;
                // let distanceMatrixUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${userLocationString}&destinations=${hospitalLocation}&mode=driving&key=${apiKey}`;
                console.log(distanceMatrixUrl);
                fetch(distanceMatrixUrl)
                    .then(response => response.json())
                    .then(data => {
                        const drivingTime = data.rows[0].elements[0].duration.text;
                        console.log(`It will take ${drivingTime} to drive from ${userLocationString} to ${hospitalName}.`);
                    })
                    .catch(error => console.log(error));
            });
        });
}
