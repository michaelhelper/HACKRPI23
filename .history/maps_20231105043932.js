let user_lat = 61.217381;
let user_lng = -149.863129;
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

    const infoElement = document.createElement("div");
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


    infoElement.innerHTML += `<p><b>Trauma Level:</b>&nbsp;${traumalvl_rate}</p>`;
    if(peds_rate != ""){
        infoElement.innerHTML += `<p><b>Pediatric:</b>&nbsp;${peds_rate}</p>`;
    }
    infoElement.innerHTML += `<p><b>Stroke:</b>&nbsp;${stroke_rate}</p>`;
    if(perinatal_rate != ""){
        infoElement.innerHTML += `<p><b>Birth:</b>&nbsp;${perinatal_rate}</p>`;
    }
    infoElement.innerHTML += `<p><b>Cardiac Center:</b>&nbsp;${PCI_rate}</p>`;
    infoElement.innerHTML += `<div id="drive"><div id="drive-time"><p><b>Drive Time:</b>&nbsp;${driveTime}<br><b>Wait Time:</b>&nbsp;${waitTime}</p></div><div id="get-direction"><button>Go</button></div></div>`;

    hospitalElement.onclick = function() {
        toggleHospital(infoElement);
    }

    hospitalElement.appendChild(hospitalMain);
    hospitalElement.appendChild(infoElement);

    return hospitalElement;
}

function all




window.onload = function() {


    // Get current location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            user_lat = lat;
            user_lng = lng;
            // Set the map view to the lat/long
            map.setView([lat, lng], 11);
			let userIcon = L.Icon.extend({
				options: {
					iconUrl: "./resources/images/person.png",
					iconSize: [48,48],
					popupAnchor:  [0, 0]
				}
			});
			const marker = L.marker([user_lat, user_lng], {icon: new userIcon()}).addTo(map);
            // Make the input field 2.5 times wider and replace the temp text with "Enter response here"
            const searchInput = document.getElementById('search-input');
            searchInput.placeholder = 'Enter response here';
        });

    }
}
