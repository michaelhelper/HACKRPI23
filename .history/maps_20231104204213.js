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
        });
    }

    // Get location from zip code
    const apiKey = 'AIzaSyA3Jn3hJdL2dFsXI8MkE9FWK8rj4jWMae0'; // Replace with your Google Maps API key

    // Function to convert ZIP code to lat/long
    function convertZipCode() {
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
    convertButton.addEventListener('click', convertZipCode);

    // Run through all hospitals in the facility list .json file and add them to the map
    const facilityList = './facilitydata.json';
    const closestHospitals = [];
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
                allHospitals.push({ name: facility.name, distance: distance });
            });

            // Sort the allHospitals array by distance
            allHospitals.sort(function(a, b) {
                return a.distance - b.distance;
            });

            // Concatenate the names of the 5 closest hospitals
            const closestHospitalNames = allHospitals.slice(0, 5).map(hospital => hospital.name).join(', ');

            // Add the 5 closest hospitals to the closestHospitals array
            closestHospitals.push(...allHospitals.slice(0, 5));

            console.log(`The 5 closest hospitals are: ${closestHospitalNames}.`);
        });
    // console log the 5 closest hospitals
    console.log(closestHospitals);
    // For each of the 5 closest hospitals, query the API for the driving time between the user's location and each hospital using Google Distance Matrix
    // why is this not working?
    
    for (let i = 0; i < closestHospitals.length; i++) {
        const facility = closestHospitals[i];
        const hospitalName = facility.name;
        const hospitalCoords = facility.coords;
        const hospitalLocation = `${hospitalCoords.x},${hospitalCoords.y}`;
        const userLocation = map.getCenter();
        const userCoords = userLocation.toString();
        const userLocationString = userCoords.replace('LatLng(', '').replace(')', '');
        const distanceMatrixUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${userLocationString}&destinations=${hospitalLocation}&mode=driving&key=${apiKey}`;
        console.log(distanceMatrixUrl);
        fetch(distanceMatrixUrl)
            .then(response => response.json())
            .then(data => {
                const drivingTime = data.rows[0].elements[0].duration.text;
                console.log(`It will take ${drivingTime} to drive from ${userLocationString} to ${hospitalName}.`);
            });
    }
}
