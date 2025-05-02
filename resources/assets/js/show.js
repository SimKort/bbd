import './bootstrap';
import { translations } from './translations';

// Tekstų atnaujinimo pagal vertimus funkcija
export function updateTexts() {
    const lang = localStorage.getItem('preferredLang') || 'lt';
    const t = translations[lang];
    const toolbarTitle = document.getElementById("toolbar-title");
    if (toolbarTitle) {toolbarTitle.textContent = t.toolbarTitle;}
    const toolbarNewRoute = document.getElementById("new-route");
    if (toolbarNewRoute) { toolbarNewRoute.textContent = t.newRouteLink; }
    const toolbarAccount = document.getElementById("accountWindowBtn");
    if (toolbarAccount) { toolbarAccount.textContent = t.userDropdownAccount; }
    const toolbarLogout = document.getElementById("logoutBtn");
    if (toolbarLogout) { toolbarLogout.textContent = t.userDropdownLogout; }
    const savedTripBackLink = document.getElementById("savedTripBackLink");
    if (savedTripBackLink) { savedTripBackLink.textContent = t.saved_trip_back_button; }
    const savedTripEditLink = document.getElementById("savedTripEditLink");
    if (savedTripEditLink) { savedTripEditLink.textContent = t.saved_trip_edit_button; }
    const savedTripPlanTitle = document.getElementById("savedTripPlanTitle");
    if (savedTripPlanTitle) { savedTripPlanTitle.textContent = t.saved_trp_plan_title; }
    const savedTripPlanStart = document.getElementById("savedTripPlanStart");
    if (savedTripPlanStart) { savedTripPlanStart.textContent = t.saved_trip_plan_start; }
    const savedTripPlanFinish = document.getElementById("savedTripPlanFinish");
    if (savedTripPlanFinish) { savedTripPlanFinish.textContent = t.saved_trip_plan_end; }
    const savedTripMapTitle = document.getElementById("savedTripMapTitle");
    if (savedTripMapTitle) { savedTripMapTitle.textContent = t.saved_trp_map_title; }
    const mapInfo = document.getElementById("map-info");
    if (mapInfo) {
        const strongTags = mapInfo.querySelectorAll("strong");
        if (strongTags.length >= 3) {
            strongTags[0].textContent = t.saved_trip_plan_distance;
            strongTags[1].textContent = t.saved_trip_plan_time;
            strongTags[2].textContent = t.saved_trip_plan_price;
        }
    }
}

// Dinamiškai gauti kelionės duomenims ir nubrėžti kelius
window.initTripMap = function () {
    const tripData = window.tripData;
    const map = new google.maps.Map(document.getElementById("trip-map"), {
        zoom: 7,
        center: { lat: tripData.start_lat, lng: tripData.start_lng }
    });
    const bounds = new google.maps.LatLngBounds();
    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer({ suppressMarkers: true });
    directionsRenderer.setMap(map);
    const waypoints = tripData.places.slice(0, tripData.places.length - 1).map(p => ({
        location: { lat: p.lat, lng: p.lng },
        stopover: true
    }));
    directionsService.route({
        origin: { lat: tripData.start_lat, lng: tripData.start_lng },
        destination: { lat: tripData.end_lat, lng: tripData.end_lng },
        travelMode: google.maps.TravelMode[tripData.mode],
        waypoints: waypoints,
        optimizeWaypoints: false
    }, function (response, status) {
        if (status === 'OK') {
            if (tripData.mode === "WALKING") {
                const allLocations = [
                    { lat: tripData.start_lat, lng: tripData.start_lng },
                    ...tripData.places.map(p => ({ lat: p.lat, lng: p.lng })),
                    { lat: tripData.end_lat, lng: tripData.end_lng }
                ];
                const fullPath = [];
                function drawWalkingSegment(i) {
                    if (i >= allLocations.length - 1) {
                        new google.maps.Polyline({
                            path: fullPath,
                            strokeColor: "black",
                            strokeOpacity: 1,
                            strokeWeight: 4,
                            map: map
                        });
                        return;
                    }
                    directionsService.route({
                        origin: allLocations[i],
                        destination: allLocations[i + 1],
                        travelMode: google.maps.TravelMode.WALKING
                    }, function (response, status) {
                        if (status === "OK") {
                            response.routes[0].legs.forEach(leg => {
                                leg.steps.forEach(step => {
                                    fullPath.push(...step.path);
                                });
                            });
                            drawWalkingSegment(i + 1);
                        } else {
                            console.error("Segmentas nepavyko:", status);
                            drawWalkingSegment(i + 1);
                        }
                    });
                }
                drawWalkingSegment(0);
            }
            else {
                const waypoints = tripData.places.slice(0, tripData.places.length - 1).map(p => ({
                    location: { lat: p.lat, lng: p.lng },
                    stopover: true
                }));
                directionsService.route({
                    origin: { lat: tripData.start_lat, lng: tripData.start_lng },
                    destination: { lat: tripData.end_lat, lng: tripData.end_lng },
                    travelMode: google.maps.TravelMode.DRIVING,
                    waypoints: waypoints,
                    optimizeWaypoints: false
                }, function (response, status) {
                    if (status === "OK") {
                        directionsRenderer.setDirections(response);
                    }
                    else {
                        console.error('Automobilio maršrutas nepavyko:', status);
                    }
                });
            }
            map.fitBounds(bounds);
        }
        else {
            console.error('Maršruto rodymas nepavyko:', status);
        }
    });
    const start = { lat: tripData.start_lat, lng: tripData.start_lng };
    const end = { lat: tripData.end_lat, lng: tripData.end_lng };
    new google.maps.Marker({ position: start, map, icon: "http://maps.google.com/mapfiles/ms/icons/green.png", title: "Pradžia" });
    bounds.extend(start);
    new google.maps.Marker({ position: end, map, icon: "http://maps.google.com/mapfiles/ms/icons/red.png", title: "Pabaiga" });
    bounds.extend(end);
    tripData.places.forEach(place => {
        const markerPos = { lat: place.lat, lng: place.lng };
        new google.maps.Marker({
            position: markerPos,
            map,
            icon: "http://maps.google.com/mapfiles/ms/icons/yellow.png",
            title: place.name
        });
        bounds.extend(markerPos);
    });
    map.fitBounds(bounds);
};
