window.onload = function() {
    // get current location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            // document.getElementById('lat').textContent = lat;
            // document.getElementById('lng').textContent = lng;
        }
        );
    }


// ----------------------------------------------------------------------------
    // get location from zip code
    const apiKey = 'AIzaSyA3Jn3hJdL2dFsXI8MkE9FWK8rj4jWMae0'; // Replace with your Google Maps API key
    // Function to convert ZIP code to lat/long
    function convertZipCode() {
        const zipCode = '10001'
        const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${zipCode}&key=${apiKey}`;
      // query the API using fetch()
        fetch(geocodingUrl)
            .then(response => response.json())
            .then(data => {
            const lat = data.results[0].geometry.location.lat;
            const lng = data.results[0].geometry.location.lng;
            alert(`The latitude is ${lat} and the longitude is ${lng}`);
            });
    }
    // Attach the function to the button's click event
    const convertButton = document.getElementById('convertButton');
    convertButton.addEventListener('click', convertZipCode);


// ----------------------------------------------------------------------------
    // create map
    const map = L.map('map').setView([51.505, -0.09], 13);
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
        marker.bindPopup(`<b>${facility.name}</b><br>${facility.address}<br>${facility.city}, ${facility.state} ${facility.zip}`);
        });
    });
    };

    // ----------------------------------------------------------------------------