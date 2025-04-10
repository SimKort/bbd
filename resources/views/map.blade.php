<!DOCTYPE html>
<html>
<head>
    <title>Kelionių maršrutas</title>
    <style>
        #map {
            height: 500px;
            width: 100%;
        }
        .controls {
            margin: 10px;
        }
        input, select {
            width: 300px;
            padding: 5px;
            margin-right: 10px;
        }
        .info {
            margin: 10px;
            font-size: 16px;
        }
    </style>
</head>
<body>
<h2>Planuok savo kelionę</h2>

<div class="controls">
    <input id="start" type="text" placeholder="Įvesk pradžios vietą">
    <input id="end" type="text" placeholder="Įvesk kelionės tikslą">
    <select id="mode">
        <option value="DRIVING">Automobiliu</option>
        <option value="WALKING">Pėsčiomis</option>
    </select>
    <button onclick="calculateRoute()">Rodyti maršrutą</button>
</div>

<div id="map"></div>
<div class="info">
    <p><strong>Atstumas:</strong> <span id="distance">-</span></p>
    <p><strong>Kelionės trukmė:</strong> <span id="duration">-</span></p>
</div>

<script>
    let map;
    let directionsService;
    let directionsRenderer;
    let startAutocomplete, endAutocomplete;

    function initMap() {
        const center = { lat: 54.6872, lng: 25.2797 }; // Vilnius
        map = new google.maps.Map(document.getElementById("map"), {
            zoom: 6,
            center: center,
        });

        directionsService = new google.maps.DirectionsService();
        directionsRenderer = new google.maps.DirectionsRenderer();
        directionsRenderer.setMap(map);

        startAutocomplete = new google.maps.places.Autocomplete(document.getElementById('start'));
        endAutocomplete = new google.maps.places.Autocomplete(document.getElementById('end'));
    }

    function calculateRoute() {
        const start = document.getElementById("start").value;
        const end = document.getElementById("end").value;
        const mode = document.getElementById("mode").value;

        if (!start || !end) {
            alert("Prašome įvesti abi vietas.");
            return;
        }

        directionsService.route({
            origin: start,
            destination: end,
            travelMode: google.maps.TravelMode[mode],
        }, function(response, status) {
            if (status === "OK") {
                directionsRenderer.setDirections(response);
                const route = response.routes[0].legs[0];
                document.getElementById("distance").textContent = route.distance.text;
                document.getElementById("duration").textContent = route.duration.text;
            } else {
                alert("Nepavyko rasti maršruto: " + status);
            }
        });
    }
</script>

<script async defer
        src="https://maps.googleapis.com/maps/api/js?key={{ config('services.google_maps.key') }}&libraries=places&callback=initMap">
</script>
</body>
</html>
