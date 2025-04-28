import { currentLanguage } from './toolbar_language_map';
import { translations } from './translations';
import './map_route_search';
import './map_search_filter';
import './map_route_creation';
import './map_places_to_route';
import './map_find_attractions';
import './map_suggested_places';
import './map_custom_place';
import './map_information_window';
import './map_trip_places';
import "./map_price_popup";
import "./map_fuel_price";

export let map, directionsService, directionsRenderer, placesService, infoWindow;
let startAutocomplete, endAutocomplete, customAutocomplete;

// Tekstų atnaujinimo pagal vertimus funkcija
export function updateTexts() {
    const t = translations[currentLanguage];
    const modeOptions = document.querySelectorAll('#mode option');
    if (modeOptions.length >= 2) {
        modeOptions[0].textContent = t.drivingChoice;
        modeOptions[1].textContent = t.walkingChoice;
    }
    const startInput = document.getElementById("start");
    if (startInput) {startInput.placeholder = t.startPlaceholder;}
    const endInput = document.getElementById("end");
    if (endInput) {endInput.placeholder = t.endPlaceholder;}
    const deselectBtn = document.querySelector('button.deselect-all-button');
    if (deselectBtn) {
        const isSelecting = deselectBtn.classList.contains('selecting');
        deselectBtn.textContent = isSelecting
            ? translations[currentLanguage].checking
            : translations[currentLanguage].uncheking;
    }
    const ratingWrapper = document.querySelector('.tooltip-wrapper label');
    if (ratingWrapper) {ratingWrapper.textContent = t.ratingsLabel;}
    const ratingTooltip = document.querySelector('.tooltip-wrapper .tooltip-text');
    if (ratingTooltip) {ratingTooltip.textContent = t.ratingTooltip;}
    const ratingOptions = document.querySelectorAll('#rating-threshold option');
    if (ratingOptions.length >= 5) {
        ratingOptions[0].textContent = t.ratingChoice1;
        ratingOptions[1].textContent = t.ratingChoice2;
        ratingOptions[2].textContent = t.ratingChoice3;
        ratingOptions[3].textContent = t.ratingChoice4;
        ratingOptions[4].textContent = t.ratingChoice5;
    }
    const radiusWrapper = document.querySelectorAll('.tooltip-wrapper label')[1];
    if (radiusWrapper) {radiusWrapper.textContent = t.radiusLabel;}
    const radiusTooltip = document.querySelectorAll('.tooltip-wrapper .tooltip-text')[1];
    if (radiusTooltip) {radiusTooltip.textContent = t.radiusTooltip;}
    const showRouteBtn = document.querySelector("button[onclick='calculateRoute()']");
    if (showRouteBtn) {showRouteBtn.textContent = t.showRoute;}
    const getPlacesBtn = document.querySelector("button[onclick='requestSuggestedPlaces()']");
    if (getPlacesBtn) {getPlacesBtn.textContent = t.getPlaces;}
    const customPlaceInput = document.getElementById("custom-place");
    if (customPlaceInput) {customPlaceInput.placeholder = t.addPlacePlaceholder;}
    const addCustomBtn = document.querySelector("button[onclick='addCustomPlace()']");
    if (addCustomBtn) {addCustomBtn.textContent = t.addCustom;}
    const placesH3 = document.querySelector(".places h3");
    if (placesH3) {placesH3.textContent = t.getPlaces;}
    const placesH4 = document.querySelector(".places h4");
    if (placesH4) {placesH4.textContent = t.addCustom;}
    const mapInfo = document.getElementById("map-info");
    if (mapInfo) {
        const items = mapInfo.querySelectorAll(".info-item strong");
        if (items.length >= 3) {
            items[0].textContent = t.distance;
            items[1].textContent = t.duration;
            items[2].textContent = t.totalCost;
        }
    }
    document.title = t.title;
    const toolbarTitle = document.getElementById("toolbar-title");
    if (toolbarTitle) {toolbarTitle.textContent = t.toolbarTitle;}
    const toolbarLoginButton = document.getElementById("login-guest-link");
    if (toolbarLoginButton) {toolbarLoginButton.textContent = t.loginButtonForGuests;}
    const dropdownBtn = document.querySelector('button[onclick="toggleDropdown()"]');
    if (dropdownBtn) {dropdownBtn.textContent = t.filtering;}
    const clearAllSuggestionsLink = document.querySelector("#suggested-clear-btn-row button");
    if (clearAllSuggestionsLink) {clearAllSuggestionsLink.textContent = t.clearAllSuggestions;}
    const confirmModalTitle = document.querySelector("#clear-suggestions-modal p");
    if (confirmModalTitle) {confirmModalTitle.textContent = t.confirmationText;}
    const confirmYesBtn = document.querySelector("#clear-suggestions-modal #confirm-clear");
    if (confirmYesBtn) {confirmYesBtn.textContent = t.confirmationYes;}
    const cancelClearBtn = document.querySelector("#clear-suggestions-modal #cancel-clear");
    if (cancelClearBtn) {cancelClearBtn.textContent = t.confirmationCancel;}
    const labelStrong = document.querySelector('label[for="radius-select"] strong');
    if (labelStrong) {labelStrong.textContent = t.radiusLabel;}
    const tripPlanTitle = document.getElementById("trip-plan-title");
    if (tripPlanTitle) {tripPlanTitle.textContent = t.tripPlanTitle;}
    const moreInfoButtons = document.querySelectorAll(".map-info-link");
    moreInfoButtons.forEach(btn => {btn.textContent = t.moreInformationButton;});
    const deleteTooltips = document.querySelectorAll(".deletetooltip-text");
    deleteTooltips.forEach(tip => {tip.textContent = t.tripItemDelete;});
    const modalTitle2 = document.querySelector("#delete-confirm-modal .confirmation-text2");
    if (modalTitle2) modalTitle2.textContent = t.confirmationText2;
    const yesBtn2 = document.querySelector("#delete-confirm-modal #confirm-delete");
    if (yesBtn2) yesBtn2.textContent = t.confirmationYes;
    const cancelBtn2 = document.querySelector("#delete-confirm-modal #cancel-delete");
    if (cancelBtn2) cancelBtn2.textContent = t.confirmationCancel;
    const bottomInfo = document.getElementById("bottom-info");
    if (bottomInfo) {
        const strongTags = bottomInfo.querySelectorAll("strong");
        if (strongTags.length >= 3) {
            strongTags[0].textContent = t.distance;
            strongTags[1].textContent = t.duration;
            strongTags[2].textContent = t.totalCost;
        }
    }
    const fuelT = translations[currentLanguage];
    const fuelButton = document.getElementById("fuel-cost-button");
    if (fuelButton) fuelButton.textContent = fuelT.fuel_cost_button;
    const fuelTitle = document.querySelector("#fuel-cost-modal .confirm-modal-content p strong");
    if (fuelTitle) fuelTitle.textContent = fuelT.fuel_title;
    const fuelPrompt = document.querySelectorAll("#fuel-cost-modal .confirm-modal-content p strong")[1];
    if (fuelPrompt) fuelPrompt.textContent = fuelT.fuel_type_prompt;
    const radioLabels = document.querySelectorAll(".fuel-radio-table label");
    if (radioLabels.length >= 4) {
        radioLabels[0].lastChild.textContent = " " + fuelT.fuel_type_gasoline;
        radioLabels[1].lastChild.textContent = " " + fuelT.fuel_type_diesel;
        radioLabels[2].childNodes[2].textContent = " " + fuelT.fuel_price_type_json;
        radioLabels[3].lastChild.textContent = " " + fuelT.fuel_price_type_custom;
    }
    const fuelLabel = document.querySelector('label[for="fuel-price-input"]');
    if (fuelLabel) fuelLabel.textContent = fuelT.fuel_price_label;
    const saveFuelBtn = document.getElementById("confirm-fuel");
    if (saveFuelBtn) saveFuelBtn.textContent = fuelT.fuel_button_save;
    const cancelFuelBtn = document.getElementById("cancel-fuel");
    if (cancelFuelBtn) cancelFuelBtn.textContent = fuelT.fuel_button_cancel;
    renderTripPlan();
}

// Google maps API užkrovimo funkcija
export function loadGoogleMapsApi(onLoadCallback = null) {
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
        return;
    }
    const lang = localStorage.getItem('preferredLang') || 'lt';
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${mapApiKey}&libraries=places&language=${lang}`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
        window.initMap();
        if (typeof onLoadCallback === 'function') {
            onLoadCallback();
        }
    };
    document.head.appendChild(script);
}
window.loadGoogleMapsApi = loadGoogleMapsApi;

// Įkeliamas Google Maps API ir atkuriami ankstesni naudotojo įvesti duomenys iš localStorage
window.addEventListener('DOMContentLoaded', () => {
    loadGoogleMapsApi(() => {
        updateTexts();
        reinitializeAutocompletes();
        document.getElementById('start').value = localStorage.getItem('startLocation') || '';
        document.getElementById('end').value = localStorage.getItem('endLocation') || '';
        document.getElementById('mode').value = localStorage.getItem('travelMode') || 'DRIVING';
        document.getElementById('radius-input').value = localStorage.getItem('radius') || 1000;
        document.getElementById('custom-place').value = localStorage.getItem('customPlace') || '';
        localStorage.removeItem('startLocation');
        localStorage.removeItem('endLocation');
        localStorage.removeItem('travelMode');
        localStorage.removeItem('radius');
        localStorage.removeItem('customPlace');
    });
});

// Automatinio užpildymo paieškos laukeliuose inicializacijos funkcija
export function reinitializeAutocompletes() {
    const options = { language: currentLanguage };
    startAutocomplete = new google.maps.places.Autocomplete(document.getElementById('start'), options);
    endAutocomplete = new google.maps.places.Autocomplete(document.getElementById('end'), options);
    customAutocomplete = new google.maps.places.Autocomplete(document.getElementById('custom-place'), options);
}

// Žemėlapio inicializacijos funkcija
function initMap() {
    const center = { lat: 54.6872, lng: 25.2797 };
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 10,
        center: center
    });
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer({
        suppressMarkers: true,
        preserveViewport: true
    });
    directionsRenderer.setMap(map);
    placesService = new google.maps.places.PlacesService(map);
    infoWindow = new google.maps.InfoWindow();
    startAutocomplete = new google.maps.places.Autocomplete(document.getElementById('start'));
    endAutocomplete = new google.maps.places.Autocomplete(document.getElementById('end'));
    customAutocomplete = new google.maps.places.Autocomplete(document.getElementById('custom-place'));
}
window.initMap = initMap;
