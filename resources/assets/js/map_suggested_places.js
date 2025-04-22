import { currentLanguage } from "./toolbar_language";
import { translations } from "./translations";
import { map, placesService } from "./map";
import { calculateRoute } from "./map_route_creation";
import { suggestedPlaces, setCurrentRatingThreshold, findAttractionsAlongRoute } from "./map_find_attractions";
import { markerMap, detailsCache } from "./map_places_to_route";
import { showInfoWindow } from "./map_information_window";
import { updateTotalPlaceCost } from "./map_price_popup";

let lastRouteSteps = [];
export function setLastRouteSteps(steps) {
    lastRouteSteps = steps;
}

// Siūlomų lankytinų vietų palei maršrutą įkėlimo ir jų antraštės rodymo funkcija
function requestSuggestedPlaces() {
    if (lastRouteSteps.length > 0) {
        const ratingSelect = document.getElementById("rating-threshold");
        setCurrentRatingThreshold(parseInt(ratingSelect?.value || 100));
        findAttractionsAlongRoute(lastRouteSteps);
        const title = document.getElementById("suggested-title");
        title.style.display = "block";
    }
}
window.requestSuggestedPlaces = requestSuggestedPlaces;

// Visų siūlomų lankytinų vietų atvaizdavimo sąraše ir žemėlapyje funkcija
export function renderSuggestedPlaces() {
    clearSuggestedPlacesList();
    suggestedPlaces.forEach((place) => {
        renderPlaceItemOrFetchDetails(place);
        addSuggestedMarker(place);
    });
    updateTotalPlaceCost();
    calculateRoute();
    updateSuggestedPlacesUI();
}

// Siūlomų vietų sąrašo išvalymo funkcija
function clearSuggestedPlacesList() {
    const list = document.getElementById("suggested-places");
    if (list){
        list.innerHTML = "";
    }
}

// Vietos informacijos iš cache arba API gavimo ir atvaizdavimo sąraše funkcija
function renderPlaceItemOrFetchDetails(place) {
    const list = document.getElementById("suggested-places");
    const li = document.createElement("li");
    li.className = "suggested-place-card";
    if (detailsCache.has(place.place_id)) {
        const details = detailsCache.get(place.place_id);
        renderSuggestedPlaceItem(li, place, details);
    }
    else {
        placesService.getDetails({
            placeId: place.place_id,
            fields: ['name', 'formatted_address', 'rating', 'user_ratings_total', 'photos', 'website', 'opening_hours', 'formatted_phone_number', 'editorial_summary', 'types', 'place_id'],
            language: currentLanguage
        }, (details, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && details) {
                detailsCache.set(place.place_id, details);
                renderSuggestedPlaceItem(li, place, details);
            }
        });
    }
    list.appendChild(li);
}

// Žymeklo žemėlapyje pridėjimo funkcija
function addSuggestedMarker(place) {
    if (!markerMap.has(place.place_id)) {
        const marker = new google.maps.Marker({
            position: place.location,
            map: map,
            title: place.name,
            icon: 'https://maps.gstatic.com/mapfiles/ms2/micons/blue.png'
        });
        marker.addListener("click", () => {
            showInfoWindow(place, marker);
        });
        place.marker = marker;
        markerMap.set(place.place_id, marker);
    }
}

// Siūlomų vietų UI elementų matomumo atnaujinimo funkcija
function updateSuggestedPlacesUI() {
    const title = document.getElementById("suggested-title");
    if (title) {
        title.style.display = suggestedPlaces.length > 0 ? "block" : "none";
    }
    const clearBtnRow = document.getElementById("suggested-clear-btn-row");
    if (clearBtnRow) {
        clearBtnRow.style.display = suggestedPlaces.length > 0 ? "flex" : "none";
    }
}

// Priartinimo žemėlapyje funkcija
function focusOnPlace(index) {
    const place = suggestedPlaces[index];
    if (place && place.marker) {
        map.setCenter(place.location);
        map.setZoom(15);
        showInfoWindow(place, place.marker);
    }
}
window.focusOnPlace = focusOnPlace;

// Lankytinos vietos kortelės pasiūlymų sąraše sukūrimo funkcija
function renderSuggestedPlaceItem(li, place, details) {
    const t = translations[currentLanguage];
    const photoUrl = details.photos?.[0]?.getUrl({maxWidth: 300}) ?? '';
    const website = details.website || '';
    place.website = website;
    li.innerHTML = `
    <div class="place-thumbnail">
        ${photoUrl ? `<img src="${photoUrl}" alt="${place.name}">` : ''}
    </div>
    <div class="place-info-container">
        <div class="place-title">${place.name}</div>
        <div class="place-address">${details.formatted_address || ''}</div>
        <div class="suggested-actions-row">
            <div class="left-info-btn">
                <button onclick="focusOnPlace(${suggestedPlaces.indexOf(place)})">${t.moreInformationButton}</button>
            </div>
            <div class="right-action-buttons">
                <div class="infotip1-wrapper">
                    <button class="add-button" onclick="addToRoute(${suggestedPlaces.indexOf(place)})">➕</button>
                    <span class="infotip1-text">${t.addToTripPlanButtonTooltip}</span>
                </div>
                <div class="infotip2-wrapper">
                    <button class="remove-button" onclick="removePlace(${suggestedPlaces.indexOf(place)})">❌</button>
                    <span class="infotip2-text">${t.deleteFromTripPlanButtonTooltip}</span>
                </div>
            </div>
        </div>
    </div>
    `;
}

// Paiūlytos vietos ištrinimo iš sąrašo funkcija
function removePlace(index) {
    const place = suggestedPlaces[index];
    const marker = markerMap.get(place.place_id);
    if (marker) {
        marker.setMap(null);
        markerMap.delete(place.place_id);
    }
    suggestedPlaces.splice(index, 1);
    renderSuggestedPlaces();
}
window.removePlace = removePlace;

// Visų lankytinų vietų iš sąrašo išvalymo patvirtinimo langelio atidarymo funkcija
function showClearSuggestionsModal() {
    document.getElementById('clear-suggestions-modal').style.display = 'block';
}
window.showClearSuggestionsModal = showClearSuggestionsModal;

// Visų lankytinų vietų iš sąrašo išvalymo patvirtinimo langelio uždarymo funkcija
function closeClearSuggestionsModal() {
    document.getElementById('clear-suggestions-modal').style.display = 'none';
}
window.closeClearSuggestionsModal = closeClearSuggestionsModal;

// Visų lankytinų vietų išvalymo funkcija
function confirmClearSuggestions() {
    suggestedPlaces.forEach(place => {
        const marker = markerMap.get(place.place_id);
        if (marker) {
            marker.setMap(null);
            markerMap.delete(place.place_id);
        }
    });
    suggestedPlaces.splice(0, suggestedPlaces.length); // ← svarbu
    document.getElementById('suggested-places').innerHTML = '';
    const title = document.getElementById('suggested-title');
    const clearBtnRow = document.getElementById("suggested-clear-btn-row");
    if (title) title.style.display = "none";
    if (clearBtnRow) clearBtnRow.style.display = "none";
    updateTotalPlaceCost();
    calculateRoute();
    closeClearSuggestionsModal();
}
window.confirmClearSuggestions = confirmClearSuggestions;
