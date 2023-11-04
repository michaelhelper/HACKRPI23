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

    // zip code to lat long converter
    const apiKey = 'YOUR_API_KEY'; // Replace with your Google Maps API key
    const zipCode = '90210'; // Replace with the ZIP code you want to convert
    const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${zipCode}&key=${apiKey}`;
    fetch(geocodingUrl)
      .then(response => response.json())
      .then(data => {
        if (data.status === 'OK') {
          const location = data.results[0].geometry.location;
          const latitude = location.lat;
          const longitude = location.lng;
          console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
        } else {
          console.error('Geocoding failed');
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
    
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
};