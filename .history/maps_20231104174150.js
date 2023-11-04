window.onload = function() {
    // temp zip code
    const zip = 12345;

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
};