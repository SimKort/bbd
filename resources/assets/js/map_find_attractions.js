import { currentLanguage } from "./toolbar_language";
import { map, placesService } from "./map";
import { addedWaypoints } from "./map_route_creation";
import { renderSuggestedPlaces } from "./map_suggested_places";

export let suggestedPlaces = [];
export let currentRatingThreshold = 100;
export function setCurrentRatingThreshold(value) {
    currentRatingThreshold = value;
}

// Naudotojo pasirinktų lankytinų vietų tipų grąžinimo funkcija
function getSelectedPlaceTypes() {
    return Array.from(document.querySelectorAll('#place-type-checkboxes input:checked')).map(cb => cb.value);
}

// Kas penkto žingsnio iš maršruto grąžinimo funkcija (optimizuoja paiešką pagal mažesnį taškų kiekį)
function getSearchSteps(steps) {
    return steps.filter((_, i) => i % 5 === 0);
}

// Vietos reikalavimų atitikimo patikrinimo funkcija
function shouldIncludePlace(place, addedPlaceIds) {
    return (
        place.rating >= 4.0 &&
        place.photos &&
        place.user_ratings_total >= currentRatingThreshold &&
        !addedPlaceIds.has(place.place_id) &&
        !suggestedPlaces.some(p => p.place_id === place.place_id) &&
        !addedWaypoints.some(p => p.place_id === place.place_id)
    );
}

// Vietos į pasiūlymų sąrašą pridėjimo funkcija
function addPlaceToSuggestions(place, addedPlaceIds) {
    addedPlaceIds.add(place.place_id);
    suggestedPlaces.push({
        name: place.name,
        location: place.geometry.location,
        place_id: place.place_id,
        cost: 0,
        type: place.types?.[0] || "tourist_attraction"
    });
}

// Lankytinų vietų paieškos užbaigimo funkcija
function finalizeAttractionSearch() {
    renderSuggestedPlaces();
    setTimeout(() => {
        const bounds = new google.maps.LatLngBounds();
        suggestedPlaces.forEach(place => {
            if (place.location) {
                bounds.extend(place.location);
            }
        });
        if (!bounds.isEmpty()) {
            map.fitBounds(bounds);
        }
    }, 100);
}

// nearbySearch užklausos konkrečiam taškui ir tipui įvykdymo funkcija
function handleNearbySearch(step, type, addedPlaceIds, onComplete) {
    const radius = parseInt(document.getElementById("radius-input").value) || 1000;
    placesService.nearbySearch({
        location: {
            lat: step.end_location.lat(),
            lng: step.end_location.lng()
        },
        radius: radius,
        type: type,
        language: currentLanguage
    }, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            results
                .filter(place => shouldIncludePlace(place, addedPlaceIds))
                .slice(0, 2)
                .forEach(place => addPlaceToSuggestions(place, addedPlaceIds));
        }
        onComplete();
    });
}

// Lankytinų vietų paieškos palei maršrutą pagal naudotojo pasirinktus tipus funkcija
export function findAttractionsAlongRoute(steps) {
    const selectedTypes = getSelectedPlaceTypes();
    if (selectedTypes.length === 0) {
        alert("Pasirinkite bent vieną filtrą.");
        return;
    }
    const stepSample = getSearchSteps(steps);
    const totalRequests = stepSample.length * selectedTypes.length;
    if (totalRequests === 0){
        return;
    }
    const addedPlaceIds = new Set();
    let pending = totalRequests;
    const onComplete = () => {
        pending--;
        if (pending === 0) {
            finalizeAttractionSearch();
        }
    };
    stepSample.forEach(step => {
        selectedTypes.forEach(type => {
            handleNearbySearch(step, type, addedPlaceIds, onComplete);
        });
    });
}
window.findAttractionsAlongRoute = findAttractionsAlongRoute;
