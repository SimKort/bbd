import { currentLanguage } from "./toolbar_language";
import { map, directionsService, directionsRenderer, placesService } from "./map";
import { setLastRouteSteps } from "./map_suggested_places";
import { setCurrentStart, setCurrentEnd, setCurrentStartName, setCurrentEndName, renderTripPlan } from "./map_trip_places";
import { setFuelStartCountry, updateTooltip } from "./map_fuel_price";

export let addedWaypoints = [];
let currentMode = "DRIVING", walkingPolyline = null, startMarker, endMarker;
let fuelModalShown = false;
export function setFuelModalShown(value) {
    fuelModalShown = value;
}

// Maršruto apskaičiavimo funkcija
export function calculateRoute() {
    directionsRenderer.set('directions', null);
    const start = document.getElementById("start").value;
    const end = document.getElementById("end").value;
    const mode = document.getElementById("mode").value;
    currentMode = mode;
    if (!start || !end){
        return;
    }
    findPlaceId(start, (startId) => {
        findPlaceId(end, (endId) => {
            getPlaceDetails(startId, (startDetails) => {
                getPlaceDetails(endId, (endDetails) => {
                    handleRouteDetails(startDetails, endDetails, start, end, mode);
                });
            });
        });
    });
}
window.calculateRoute = calculateRoute;

// Vietos ID pagal pateiktą paieškos užklausą radimo funkcija
function findPlaceId(query, callback) {
    placesService.findPlaceFromQuery({ query, fields: ['place_id'] }, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results[0]) {
            callback(results[0].place_id);
        }
    });
}

// Detalios informacijos apie vietą gavimo funkcija
function getPlaceDetails(placeId, callback) {
    placesService.getDetails({
        placeId,
        fields: ['name', 'formatted_address', 'geometry', 'address_components'],
        language: currentLanguage
    }, (details, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && details) {
            callback(details);
        }
    });
}

// Pradžios/pabaigos informacijos nutatymo funkcija
function handleRouteDetails(startDetails, endDetails, start, end, mode) {
    setCurrentStart(startDetails.formatted_address);
    setCurrentEnd(endDetails.formatted_address);
    setCurrentStartName(startDetails.name);
    setCurrentEndName(endDetails.name);
    if (startMarker){
        startMarker.setMap(null);
    }
    if (endMarker){
        endMarker.setMap(null);
    }
    startMarker = new google.maps.Marker({
        position: startDetails.geometry.location,
        map,
        icon: "http://maps.google.com/mapfiles/ms/icons/green.png"
    });
    endMarker = new google.maps.Marker({
        position: endDetails.geometry.location,
        map,
        icon: "http://maps.google.com/mapfiles/ms/icons/red.png"
    });
    renderTripPlan();
    requestRoute(start, end, mode);
    const countryComponent = startDetails.address_components.find(c => c.types.includes("country"));
    const countryCode = countryComponent?.short_name || null;
    setFuelStartCountry(countryCode);
    updateTooltip()
}

// Maršruto su tarpiniais taškais pagal pasirinktą keliavimo būdą užklausos funkcija
function requestRoute(start, end, mode) {
    directionsService.route({
        origin: start,
        destination: end,
        travelMode: google.maps.TravelMode[mode],
        waypoints: addedWaypoints.map(p => ({ location: p.location, stopover: true })),
        optimizeWaypoints: true
    }, handleRouteResponse);
    if (mode === "DRIVING" && !fuelModalShown) {
        setTimeout(() => {
            const modal = document.getElementById("fuel-cost-modal");
            if (modal) {
                modal.style.display = "block";
                fuelModalShown = true;
            }
        }, 500);
    }
}

// Directions API atsakymo apdorojimo funkcija
function handleRouteResponse(response, status) {
    if (status !== "OK") {
        alert("Nepavyko rasti maršruto: " + status);
        return;
    }
    clearExistingPolyline();
    if (currentMode === "WALKING") {
        drawWalkingPolyline(response);
    }
    else {
        renderDrivingRoute(response);
    }
    calculateAndDisplayRouteSummary(response);
    fitMapToRouteBounds(response);
    const order = response.routes[0].waypoint_order || [];
    const sortedWaypoints = order.map(index => addedWaypoints[index]);
    renderTripPlan(sortedWaypoints);
    showPlacesSection();
}

// Esamos pėsčiųjų maršruto linijos pašalinimo iš žemėlapio funkcija
function clearExistingPolyline() {
    if (walkingPolyline) {
        walkingPolyline.setMap(null);
        walkingPolyline = null;
    }
}

// Pėsčiųjų maršruto linijos sukūrimo žemėlapyje funkcija
function drawWalkingPolyline(response) {
    const path = [];
    response.routes[0].legs.forEach(leg => {
        leg.steps.forEach(step => path.push(...step.path));
    });
    walkingPolyline = new google.maps.Polyline({
        path,
        strokeColor: "black",
        strokeOpacity: 1,
        strokeWeight: 4,
        map
    });
}

// Vairavimo maršrutą žemėlapyje naudojant DirectionsRenderer parodymo funkcija
function renderDrivingRoute(response) {
    directionsRenderer.setDirections(response);
}

// Atstumo ir trukmės apskaičiavimo ir atvaizdavimo funkcija
function calculateAndDisplayRouteSummary(response) {
    const route = response.routes[0].legs.reduce((acc, leg) => {
        acc.distance += leg.distance.value;
        acc.duration += leg.duration.value;
        return acc;
    }, { distance: 0, duration: 0 });
    const distanceKm = (route.distance / 1000).toFixed(1) + " km";
    const durationMin = Math.round(route.duration / 60) + " min";
    document.getElementById("distance").textContent = distanceKm;
    document.getElementById("duration").textContent = durationMin;
    document.getElementById("distance-bottom").textContent = distanceKm;
    document.getElementById("duration-bottom").textContent = durationMin;
    setLastRouteSteps(response.routes[0].legs[0].steps);
}

// Reikiamo kelio tilpimo žemėlapyje funkcija
function fitMapToRouteBounds(response) {
    const bounds = new google.maps.LatLngBounds();
    response.routes[0].legs.forEach(leg => {
        bounds.extend(leg.start_location);
        bounds.extend(leg.end_location);
    });
    google.maps.event.trigger(map, "resize");
    setTimeout(() => {
        map.fitBounds(bounds);
    }, 50);
}

// Lankytinų vietų elemento atvaizdavimo funkcija
function showPlacesSection() {
    document.getElementById("places-section").style.display = "block";
}
