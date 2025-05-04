import { currentLanguage } from './toolbar_language_map';
import { translations } from './translations';
import { addedWaypoints, calculateRoute, getEndMarker, getStartMarker } from './map_route_creation';
import {getCurrentEndName, getCurrentStartName, renderTripPlan} from "./map_trip_places";
import { getFuelData } from './map_fuel_price';
import {updateTotalPlaceCost} from "./map_price_popup";
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
import "./map_trip_saving";

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
    const toolbarSavedRoutes = document.getElementById("saved-routes2");
    if (toolbarSavedRoutes) { toolbarSavedRoutes.textContent = t.savedRoutesList; }
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
    const toolbarAccount = document.getElementById("accountWindowBtn");
    if (toolbarAccount) { toolbarAccount.textContent = t.userDropdownAccount; }
    const toolbarLogout = document.getElementById("logoutBtn");
    if (toolbarLogout) { toolbarLogout.textContent = t.userDropdownLogout; }
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
    const saveTripPlanBtn = document.getElementById("saveTripPlan");
    if (saveTripPlanBtn) { saveTripPlanBtn.textContent = t.save_trip_plan; }
    const saveTripPlanTitle = document.getElementById("tripTitle");
    if (saveTripPlanTitle) { saveTripPlanTitle.textContent = t.save_trip_plan_title; }
    const saveTripPlanBtnConfirm = document.getElementById("confirm-trip-title");
    if (saveTripPlanBtnConfirm) { saveTripPlanBtnConfirm.textContent = t.save_trip_plan_confirm; }
    const saveTripPlanBtnCancel = document.getElementById("cancel-trip-title");
    if (saveTripPlanBtnCancel) { saveTripPlanBtnCancel.textContent = t.save_trip_plan_cancel; }
    const updateTripPlanBtn = document.getElementById("updateTripPlanBtn");
    if (updateTripPlanBtn) { updateTripPlanBtn.textContent = t.update_trip_plan; }
    const cancelUpdateTripPlanBtn = document.getElementById("cancelUpdateTripPlanBtn");
    if (cancelUpdateTripPlanBtn) { cancelUpdateTripPlanBtn.textContent = t.cancel_update_trip_plan; }
    const guestModalText = document.getElementById("guest-restriction-modal-text");
    if (guestModalText) { guestModalText.textContent = t.guest_restriction_modal_text; }
    const guestModalLogin = document.getElementById("guest-restriction-modal-login");
    if (guestModalLogin) { guestModalLogin.textContent = t.guest_restriction_modal_login; }
    const guestModalRegister = document.getElementById("guest-restriction-modal-register");
    if (guestModalRegister) { guestModalRegister.textContent = t.guest_restriction_modal_register; }
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
window.addEventListener("DOMContentLoaded", () => {
    loadGoogleMapsApi(() => {
        updateTexts();
        reinitializeAutocompletes();
        if (!window.tripData) {
            document.getElementById('start').value = localStorage.getItem('startLocation') || '';
            document.getElementById('end').value = localStorage.getItem('endLocation') || '';
            document.getElementById('mode').value = localStorage.getItem('travelMode') || 'DRIVING';
        }
        if (window.tripData) { preloadTrip(window.tripData); }
        localStorage.removeItem('startLocation');
        localStorage.removeItem('endLocation');
        localStorage.removeItem('travelMode');
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
}
window.initMap = initMap;

// Duomenų užkrovimo norimos kelionės atnaujinimui funkcija
function preloadTrip(trip) {
    if (!trip) { return; }
    const startInput = document.getElementById('start');
    const endInput = document.getElementById('end');
    if (startInput) startInput.value = trip.start_address || '';
    if (endInput) endInput.value = trip.end_address || '';
    const modeSelect = document.getElementById('mode');
    if (modeSelect && trip.mode) { modeSelect.value = trip.mode.toUpperCase(); }
    setTimeout(() => {
        calculateRoute();
    }, 300);
    if (trip.fuel_consumption) { document.getElementById("fuel-input").value = trip.fuel_consumption; }
    if (trip.fuel_price) {
        document.getElementById("fuel-price-input").value = trip.fuel_price;
        document.querySelector('input[name="fuel-input"][value="custom"]').checked = true;
        document.getElementById("custom-price-wrapper").style.display = "block";
    }
    if (trip.fuel_type) {
        const radio = document.querySelector(`input[name="fuel-type"][value="${trip.fuel_type}"]`);
        if (radio) radio.checked = true;
    }
    if (trip.fuel_consumption) {
        setTimeout(() => {
            const confirmFuelButton = document.getElementById("confirm-fuel");
            if (confirmFuelButton && typeof confirmFuelButton.onclick === 'function') { confirmFuelButton.onclick(); }
        }, 1800);
    }
    else{
        setTimeout(() => {
            const fuelModal = document.getElementById("fuel-cost-modal");
            if (fuelModal) { fuelModal.style.display = "none"; }
        }, 2000);
    }
    trip.places.forEach(place => {
        const lat = parseFloat(place.lat);
        const lng = parseFloat(place.lng);
        if (isNaN(lat) || isNaN(lng)) {
            console.warn('Netinkamos koordinatės:', place);
            return;
        }
        const marker = new google.maps.Marker({
            position: { lat, lng },
            map: map,
            title: place.name,
            icon: 'https://maps.gstatic.com/mapfiles/ms2/micons/yellow.png'
        });
        marker.addListener('click', () => {
            showInfoWindow(place, marker);
        });
        if (!place.website && place.place_id) {
            placesService.getDetails({
                placeId: place.place_id,
                fields: ['website'],
                language: currentLanguage
            }, (details, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK && details?.website) { place.website = details.website; }
            });
        }
        addedWaypoints.push({
            ...place,
            location: { lat, lng },
            marker: marker,
            price: parseFloat(place.price) || 0,
        });
        updateTotalPlaceCost();
    });
    setTimeout(() => {
        calculateRoute();
    }, 2100);
    const fuelBtn = document.getElementById("fuel-cost-button");
    if (trip.mode === "WALKING" && fuelBtn) { fuelBtn.style.display = "none"; }
    else if (fuelBtn) { fuelBtn.style.display = "inline-block"; }
}
window.preloadTrip = preloadTrip;

// Atnaujintos kelionės išsaugojimo funkcija
function saveUpdatedTrip() {
    if (!window.tripData?.id) {
        alert("Trūksta kelionės ID.");
        return;
    }
    const title = window.tripData.title;
    const startMarker = getStartMarker();
    const endMarker = getEndMarker();
    const startLat = startMarker?.getPosition()?.lat();
    const startLng = startMarker?.getPosition()?.lng();
    const endLat = endMarker?.getPosition()?.lat();
    const endLng = endMarker?.getPosition()?.lng();
    const mode = document.getElementById("mode").value || "DRIVING";
    const distanceText = document.getElementById('distance-bottom')?.innerText.replace(' km', '') || '0';
    const durationText = document.getElementById('duration-bottom')?.innerText.replace(' min', '') || '0';
    const costText = document.getElementById('total-place-cost-bottom')?.innerText.replace('€', '').trim() || '0';
    const tripItems = document.querySelectorAll('#trip-plan-list li[data-place-id]');
    const places = [];
    tripItems.forEach((item, index) => {
        const placeId = item.dataset.placeId;
        const name = item.querySelector('.trip-place-name')?.innerText.replace(/💶/g, '').trim() || '';
        const type = item.dataset.type || 'tourist_attraction';
        const address = item.querySelector('.trip-place-address')?.innerText || '';
        const price = parseFloat(item.dataset.price || 0);
        const lat = parseFloat(item.dataset.lat);
        const lng = parseFloat(item.dataset.lng);
        const website = item.dataset.website || '';
        if (placeId && name && address && !isNaN(lat) && !isNaN(lng)) {
            places.push({
                place_id: placeId,
                name,
                type,
                address,
                price,
                order: index + 1,
                lat,
                lng,
                website
            });
        }
    });
    const fuelData = getFuelData();
    if (mode === "WALKING") {
        fuelData.fuel_type = null;
        fuelData.fuel_price = null;
        fuelData.fuel_consumption = null;
    }
    const payload = {
        title,
        start_name: getCurrentStartName(),
        start_address: document.getElementById("start").value,
        start_lat: startLat,
        start_lng: startLng,
        end_name: getCurrentEndName(),
        end_address: document.getElementById("end").value,
        end_lat: endLat,
        end_lng: endLng,
        distance: parseFloat(distanceText),
        duration: parseInt(durationText),
        price_total: parseFloat(costText),
        mode: mode,
        fuel_type: fuelData.fuel_type,
        fuel_price: isNaN(fuelData.fuel_price) ? null : fuelData.fuel_price,
        fuel_consumption: isNaN(fuelData.fuel_consumption) ? null : fuelData.fuel_consumption,
        places,
    };
    fetch(`/trips/${window.tripData.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
        },
        body: JSON.stringify(payload),
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                window.location.href = '/trips';
            } else {
                alert("Serverio klaida: " + (data.error || "Nežinoma"));
            }
        })
        .catch(err => {
            console.error(err);
            alert("Klaida siunčiant duomenis.");
        });
}
window.saveUpdatedTrip = saveUpdatedTrip;
