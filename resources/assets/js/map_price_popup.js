import { translations } from "./translations";
import { currentLanguage } from "./toolbar_language_map";
import { addedWaypoints } from "./map_route_creation";
import { suggestedPlaces } from "./map_find_attractions";
import { renderTripPlan } from "./map_trip_places";
import { updateTotalCombinedCost } from './map_fuel_price';
export let totalObjectCost = 0;
let currentPricePopup = null;

// Kainos įvedimo laukelio atidarymo funkcija
function showPricePopup(place, anchor) {
    removeCurrentPricePopup();
    const popup = createPricePopup(place);
    attachPricePopupEvents(popup, place);
    document.body.appendChild(popup);
    positionPopup(popup, anchor);
    currentPricePopup = popup;
}
window.showPricePopup = showPricePopup;

// Aktyvaus kainos laukelio uždarymo funkcija
function removeCurrentPricePopup() {
    if (currentPricePopup) {
        currentPricePopup.remove();
        currentPricePopup = null;
    }
}

// Kainos įvedimo laukelio sukūrimo funkcija
function createPricePopup(place) {
    const t = translations[currentLanguage];
    const popup = document.createElement("div");
    popup.className = "price-popup";
    popup.innerHTML = `
        <div class="popup-header">
            <span class="close-button">×</span>
        </div>
        <p>${t.priceInfoText}</p>
        <p><a href="${place.website}" target="_blank">${t.priceWebsiteLink}</a></p>
        <label>${t.priceInputLabel}</label>
        <input type="number" min="0" step="0.1" value="${place.cost || ''}">
        <div class="popup-actions">
            <button>${t.save}</button>
        </div>`;
    return popup;
}

// Kainos įvedimo laukelio mygtukų veiksmų priskyrimo ir uždarymo funkcija
function attachPricePopupEvents(popup, place) {
    const saveButton = popup.querySelector("button");
    const input = popup.querySelector("input");
    const closeButton = popup.querySelector(".close-button");
    saveButton.onclick = () => {
        const newCost = parseFloat(input.value) || 0;
        place.cost = newCost;
        place.price = newCost;
        updateTotalPlaceCost();
        renderTripPlan();
        removeCurrentPricePopup();
    };
    closeButton.onclick = removeCurrentPricePopup;
    document.addEventListener("click", (e) => {
        if (currentPricePopup && !currentPricePopup.contains(e.target) && e.target.innerHTML !== "💶") {
            removeCurrentPricePopup();
        }
    }, { once: true });
}

// Kainos įvedimo laukelio pozicionavimo funkcija
function positionPopup(popup, anchor) {
    const rect = anchor.getBoundingClientRect();
    popup.style.position = "absolute";
    popup.style.top = `${rect.top + window.scrollY - popup.offsetHeight - 8}px`;
    popup.style.left = `${rect.left + window.scrollX}px`;
}

// Kainos įvedimo laukelio uždarymas, paspaudus už jo ribų
document.addEventListener("click", function(event) {
    const popup = document.getElementById("price-popup");
    if (popup && !popup.contains(event.target) && !event.target.classList.contains('money-button')) {
        popup.style.display = "none";
    }
});

// Vietos nustatytos kainos atnaujinimo funkcija
export function updatePlaceCost(index) {
    const input = document.getElementById(`place-cost-${index}`);
    suggestedPlaces[index].cost = parseFloat(input.value) || 0;
    updateTotalPlaceCost();
}
window.updatePlaceCost = updatePlaceCost;

// Visos kelionės kainos atnaujinimo funkcija
export function updateTotalPlaceCost() {
    const totalSuggested = suggestedPlaces.reduce((sum, p) => sum + (p.cost || 0), 0);
    const totalAdded = addedWaypoints.reduce((sum, p) => sum + (p.cost || 0), 0);
    totalObjectCost = totalSuggested + totalAdded;
    updateTotalCombinedCost();
}
