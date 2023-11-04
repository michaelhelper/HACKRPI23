window.onload = function() {
    // get current location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            // document.getElementById('lat').textContent = lat;
            // document.getElementById('lng').textContent = lng;
            // set the map view to the lat/long
            map.setView([lat, lng], 10);
        }
        );
    }


// ----------------------------------------------------------------------------
    // get location from zip code
    const apiKey = 'AIzaSyA3Jn3hJdL2dFsXI8MkE9FWK8rj4jWMae0'; // Replace with your Google Maps API key
    // Function to convert ZIP code to lat/long
    function convertZipCode() {
        const zipCode = '12180'
        const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${zipCode}&key=${apiKey}`;
      // query the API using fetch()
        fetch(geocodingUrl)
            .then(response => response.json())
            .then(data => {
            const lat = data.results[0].geometry.location.lat;
            const lng = data.results[0].geometry.location.lng;
            // set the map view to the lat/long
            map.setView([lat, lng], 10);
            alert(`The latitude is ${lat} and the longitude is ${lng}`);
            });
    }
    // Attach the function to the button's click event
    const convertButton = document.getElementById('convertButton');
    convertButton.addEventListener('click', convertZipCode);


// ----------------------------------------------------------------------------
    // create map
    const map = L.map('map').setView([42.7291949, -73.6795041], 10);
    const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    // run through all hospitals in the facility list .json file and add them to the map
    const facilityList = './facilitydata.json';
    fetch(facilityList)
    .then(response => response.json())
    .then(data => {
        data.hospitals.forEach(facility => {
        const marker = L.marker([facility.coords.x, facility.coords.y]).addTo(map);
        marker.bindPopup(`<b>${facility.name}</b><br>${facility.address}<br>`);
        // add a marker to the map
        // const marker = L.marker([facility.coords.x, facility.coords.y]).addTo(map);
        });
    });
    };

    // ----------------------------------------------------------------------------