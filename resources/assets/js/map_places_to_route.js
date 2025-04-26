import { translations } from "./translations";
import { currentLanguage } from "./toolbar_language_map";
import { map, placesService } from "./map";
import { addedWaypoints, calculateRoute } from "./map_route_creation";
import { suggestedPlaces } from "./map_find_attractions";
import { renderSuggestedPlaces } from "./map_suggested_places";
import { showInfoWindow } from "./map_information_window";
import { renderTripPlan } from "./map_trip_places";

export let markerMap = new Map(), detailsCache = new Map();

// Patikrinimo ar vieta jau pridėta funkcija
function isAlreadyAdded(placeId) {
    return addedWaypoints.find(p => p.place_id === placeId);
}

// Patikrinimo ar pasiektas maksimalus pridėtų vietų limitas (20) funkcija
function isLimitExceeded() {
    return addedWaypoints.length >= 20;
}

// Užtikrinimo, kad žemėlapyje egzistuoja vietos žymeklis, funkcija
function ensureMarkerExists(place) {
    let marker = markerMap.get(place.place_id);
    if (!marker) {
        marker = new google.maps.Marker({
            position: place.location,
            map: map,
            title: place.name
        });
        marker.addListener("click", () => {
            showInfoWindow(place, marker);
        });
        markerMap.set(place.place_id, marker);
    }
    return marker;
}

// Vietos pridėjimo į kelionės maršrutą funkcija
function addPlaceToWaypoints(place, marker) {
    const copiedPlace = {
        ...place,
        marker: marker,
        website: place.website,
        address: place.address
    };
    marker.setIcon("https://maps.gstatic.com/mapfiles/ms2/micons/yellow.png");
    addedWaypoints.push(copiedPlace);
    suggestedPlaces.splice(suggestedPlaces.indexOf(place), 1);
    renderSuggestedPlaces();
    renderTripPlan();
    calculateRoute();
}

// Vietos aprašymo informacijos gavimo funkcija
function getPlaceDetailsAndAdd(place) {
    placesService.getDetails({
        placeId: place.place_id,
        fields: ["formatted_address", "website"],
        language: currentLanguage
    }, (details, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && details) {
            detailsCache.set(place.place_id, details);
            place.address = details.formatted_address || "";
            place.website = details.website || null;
            const marker = markerMap.get(place.place_id);
            addPlaceToWaypoints(place, marker);
        }
    });
}

// Vietos pridėjimo į maršrutą funkcija
export function addToRoute(index) {
    const place = suggestedPlaces[index];
    if (isAlreadyAdded(place.place_id)) {
        alert(translations[currentLanguage].alreadyAdded);
        return;
    }
    if (isLimitExceeded()) {
        alert(translations[currentLanguage].exceedingLimit);
        return;
    }
    const marker = ensureMarkerExists(place);
    if (detailsCache.has(place.place_id)) {
        const details = detailsCache.get(place.place_id);
        place.address = details.formatted_address || "";
        place.website = details.website || null;
        addPlaceToWaypoints(place, marker);
    }
    else {
        getPlaceDetailsAndAdd(place);
    }
}
window.addToRoute = addToRoute;
