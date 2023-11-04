
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


window.onload = function() {
    // get current location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            // document.getElementById('lat').textContent = lat;
            // document.getElementById('lng').textContent = lng;
            // set the map view to the lat/long
            map.setView([lat, lng], 11);
        }
        );
    }


// ----------------------------------------------------------------------------
    // get location from zip code
    const apiKey = 'AIzaSyA3Jn3hJdL2dFsXI8MkE9FWK8rj4jWMae0'; // Replace with your Google Maps API key
    // Function to convert ZIP code to lat/long
    function convertZipCode() {
        // Get the ZIP code from the form
        const zipCode = document.getElementById('search-input').value;
        const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${zipCode}&key=${apiKey}`;
      // query the API using fetch()
        fetch(geocodingUrl)
            .then(response => response.json())
            .then(data => {
            const lat = data.results[0].geometry.location.lat;
            const lng = data.results[0].geometry.location.lng;
            // set the map view to the lat/long
            map.setView([lat, lng], 11);
            alert(`The latitude is ${lat} and the longitude is ${lng}`);
            });
        return { lat, lng };
    }

    // Attach the function to the button's click event
    const convertButton = document.getElementById('search-button');
    convertButton.addEventListener('click', async () => {
      try {
        const location = await convertZipCode();
        console.log(`The latitude is ${location.lat} and the longitude is ${location.lng}`);
        // You can save location.lat and location.lng to a variable or perform other actions here.
      } catch (error) {
        console.error('An error occurred:', error);
      }
    });


// ----------------------------------------------------------------------------
    // create map
    const map = L.map('map').setView([47.7291949, -73.6795041], 11);
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
        // add a popup not attached to a marker
        // const popup = L.popup()
        // .setLatLng([facility.coords.x, facility.coords.y])
        // .setContent(`<b>${facility.name}</b><br>${facility.address}<br>`)
        // .openOn(map);

        });
    });
    };

    // ----------------------------------------------------------------------------