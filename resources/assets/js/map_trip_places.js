import { translations } from "./translations";
import { currentLanguage } from "./toolbar_language_map";
import { addedWaypoints, calculateRoute, getSortedWaypointsByLastRouteOrder } from "./map_route_creation";
import { markerMap } from "./map_places_to_route";
import { showInfoWindow } from "./map_information_window";
import { updateTotalPlaceCost } from "./map_price_popup";

let currentStart = "", currentEnd = "", currentStartName = "", currentEndName = "", pendingPlaceToDelete = null;
export function setCurrentStart(val) {
    currentStart = val;
}
export function setCurrentEnd(val) {
    currentEnd = val;
}
export function setCurrentStartName(val) {
    currentStartName = val;
}
export function setCurrentEndName(val) {
    currentEndName = val;
}
export function getCurrentStartName() {
    return currentStartName;
}
export function getCurrentEndName() {
    return currentEndName;
}

const placeTypeIcons = {
    tourist_attraction: "📍",
    museum: "🏛️",
    art_gallery: "🖼️",
    park: "🌳",
    natural_feature: "⛰️",
    zoo: "🦁",
    aquarium: "🐠",
    amusement_park: "🎢",
    church: "⛪",
    hindu_temple: "🛕",
    synagogue: "🕍"
};

// Galutinio kelionės plano sąrašo sukūrimo funkcija
export function renderTripPlan(sortedWaypoints = addedWaypoints) {
    const t = translations[currentLanguage];
    const list = document.getElementById("trip-plan-list");
    const title = document.getElementById("trip-plan-title");
    const section = document.getElementById("trip-plan-section");
    if (!list || !section){
        return;
    }
    section.style.display = sortedWaypoints.length === 0 ? "none" : "block";
    if (title){
        title.textContent = t.tripPlanTitle;
    }
    list.innerHTML = "";
    list.appendChild(renderTripPoint(currentStartName || currentStart, currentStart, "🏁", t.startPoint, "start-point"));
    sortedWaypoints.forEach((place, i) => {
        list.appendChild(renderTripItem(place, i));
    });
    list.appendChild(renderTripPoint(currentEndName || currentEnd, currentEnd, "🎯", t.endPoint, "end-point"));
}
window.renderTripPlan = renderTripPlan;

// Sąrašo elemento pradžios arba pabaigos taškui sukūrimo funkcija
function renderTripPoint(name, address, icon, label, className) {
    const li = document.createElement("li");
    li.classList.add("trip-plan-item", className);
    const content = document.createElement("div");
    content.className = "plan-content";
    const row = document.createElement("div");
    row.className = "place-row";
    const left = document.createElement("div");
    left.className = "place-left";
    const iconEl = document.createElement("span");
    iconEl.className = "plan-icon";
    iconEl.textContent = icon;
    const labelEl = document.createElement("span");
    labelEl.className = "plan-number";
    labelEl.textContent = label;
    const nameEl = document.createElement("span");
    nameEl.className = "place-name";
    nameEl.textContent = name;
    left.appendChild(iconEl);
    left.appendChild(labelEl);
    left.appendChild(nameEl);
    row.appendChild(left);
    content.appendChild(row);
    if (address) {
        const addressRow = document.createElement("div");
        addressRow.className = "plan-address-row";
        const addressEl = document.createElement("div");
        addressEl.className = "plan-address";
        addressEl.textContent = address;
        addressRow.appendChild(addressEl);
        content.appendChild(addressRow);
    }
    li.appendChild(content);
    return li;
}

// Sąrašo elemento tarpiniam taškui sukūrimo funkcija
function renderTripItem(place, i) {
    const li = document.createElement("li");
    li.classList.add("trip-plan-item");
    li.dataset.placeId = place.place_id;
    li.dataset.type = place.type || 'tourist_attraction';
    li.dataset.lat = place.lat;
    li.dataset.lng = place.lng;
    li.dataset.price = place.cost ?? place.price ?? 0;
    li.dataset.website = place.website || '';
    const content = document.createElement("div");
    content.className = "plan-content";
    const row = document.createElement("div");
    row.className = "place-row";
    const left = createTripItemLeft(place, i);
    const actions = createTripItemActions(place);
    row.appendChild(left);
    row.appendChild(actions);
    content.appendChild(row);
    if (place.address) {
        const addressRow = document.createElement("div");
        addressRow.className = "plan-address-row";
        const address = document.createElement("div");
        address.className = "trip-place-address";
        address.textContent = place.address;
        const mapInfo = document.createElement("button");
        mapInfo.className = "map-info-link";
        mapInfo.textContent = translations[currentLanguage].seeOnMap;
        mapInfo.onclick = () => scrollToMapAndShowInfo(place);
        addressRow.appendChild(address);
        addressRow.appendChild(mapInfo);
        content.appendChild(addressRow);
        li.onmouseenter = () => mapInfo.style.opacity = "1";
        li.onmouseleave = () => mapInfo.style.opacity = "0";
    }
    li.appendChild(content);
    return li;
}

// Kairės informacijos pusės sukūrimo funkcija
function createTripItemLeft(place, i) {
    const left = document.createElement("div");
    left.className = "place-left";
    const icon = placeTypeIcons[place.type] || "📍";
    const nameSpan = document.createElement("span");
    nameSpan.className = "place-name trip-place-name";
    nameSpan.textContent = place.name;
    if (place.website) {
        const priceBtn = document.createElement("button");
        priceBtn.className = "price-button";
        priceBtn.innerHTML = "💶";
        priceBtn.onclick = (e) => {
            e.stopPropagation();
            showPricePopup(place, e.target);
        };
        nameSpan.appendChild(priceBtn);
    }
    left.innerHTML = `
        <span class="plan-icon">${icon}</span>
        <span class="plan-number">${i + 1}.</span>`;
    left.appendChild(nameSpan);
    return left;
}

// Pašalinimo mygtuko dešinėje pusėje sukūrimo funkcija
function createTripItemActions(place) {
    const actions = document.createElement("div");
    actions.className = "place-actions";
    const deleteWrapper = document.createElement("div");
    deleteWrapper.className = "deletetooltip-wrapper";
    const removeBtn = document.createElement("button");
    removeBtn.className = "delete-button";
    removeBtn.innerHTML = "🗑️";
    removeBtn.onclick = () => confirmRemoveFromTrip(place);
    const tooltip = document.createElement("span");
    tooltip.className = "deletetooltip-text";
    tooltip.textContent = translations[currentLanguage].tripItemDelete;
    deleteWrapper.appendChild(removeBtn);
    deleteWrapper.appendChild(tooltip);
    actions.appendChild(deleteWrapper);
    return actions;
}

// Paslinkimo iki žemėlapio ir informacinio langelio parodymo funkcija
function scrollToMapAndShowInfo(place) {
    const mapElement = document.getElementById("map");
    if (mapElement) {
        const offset = -100;
        const top = mapElement.getBoundingClientRect().top + window.scrollY + offset;
        window.scrollTo({ top, behavior: "smooth" });
    }
    showInfoWindow(place, place.marker);
}

// Pasirinktos vietos pašalinimo iš galutinio kelionės plano funkcija
function removeFromTrip(placeToRemove) {
    const marker = markerMap.get(placeToRemove.place_id);
    if (marker) {
        marker.setMap(null);
        markerMap.delete(placeToRemove.place_id);
    }
    const index = addedWaypoints.findIndex(p => p.place_id === placeToRemove.place_id);
    if (index !== -1) {
        addedWaypoints.splice(index, 1);
    }
    updateTotalPlaceCost();
    renderTripPlan(getSortedWaypointsByLastRouteOrder());
    calculateRoute();
}
window.removeFromTrip = removeFromTrip;

// Galutinio plano objekto ištrinimo funkcija
function confirmRemoveFromTrip(place) {
    pendingPlaceToDelete = place;
    document.getElementById("delete-confirm-modal").style.display = "block";
}

// Patvirtinus šalinimą, pašalina pasirinktą vietą iš kelionės plano
document.getElementById("confirm-delete").onclick = () => {
    if (pendingPlaceToDelete) {
        removeFromTrip(pendingPlaceToDelete);
        pendingPlaceToDelete = null;
    }
    document.getElementById("delete-confirm-modal").style.display = "none";
};

// Paspaudus atšaukti, atšaukia šalinimą ir uždaro patvirtinimo langelį“
document.getElementById("cancel-delete").onclick = () => {
    pendingPlaceToDelete = null;
    document.getElementById("delete-confirm-modal").style.display = "none";
};
