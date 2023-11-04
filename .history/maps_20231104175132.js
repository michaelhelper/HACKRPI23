window.onload = function() {
    // get current location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            document.getElementById('lat').textContent = lat;
            document.getElementById('lng').textContent = lng;
        }
        );
    }
    
    // AIzaSyA3Jn3hJdL2dFsXI8MkE9FWK8rj4jWMae0
    const map = L.map('map').setView([51.505, -0.09], 13);
    const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    const marker = L.marker([51.5, -0.09]).addTo(map)
    .bindPopup('<b>Test Hospital</b><br />I am a popup.').openPopup();

    function onMapClick(e) {
        popup
            .setLatLng(e.latlng)
            .setContent(`You clicked the map at ${e.latlng.toString()}`)
            .openOn(map);
    }
    map.on('click', onMapClick);

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
            document.getElementById('lat').textContent = lat;
            document.getElementById('lng').textContent = lng;
            });
    }
    // Attach the function to the button's click event
    const convertButton = document.getElementById('convertButton');
    convertButton.addEventListener('click', convertZipCode);
};