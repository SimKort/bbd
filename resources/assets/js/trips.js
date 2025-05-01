import './bootstrap';
import { translations } from './translations';

// Tekstų atnaujinimo pagal vertimus funkcija
export function updateTexts() {
    const lang = localStorage.getItem('preferredLang') || 'lt';
    const t = translations[lang];
    document.title = t.tittleTrips;
    const toolbarTitle = document.getElementById("toolbar-title");
    if (toolbarTitle) {toolbarTitle.textContent = t.toolbarTitle;}
    const toolbarNewRoute = document.getElementById("new-route");
    if (toolbarNewRoute) { toolbarNewRoute.textContent = t.newRouteLink; }
    const toolbarAccount = document.getElementById("accountWindowBtn");
    if (toolbarAccount) { toolbarAccount.textContent = t.userDropdownAccount; }
    const toolbarLogout = document.getElementById("logoutBtn");
    if (toolbarLogout) { toolbarLogout.textContent = t.userDropdownLogout; }
    const myTripsTitle = document.getElementById("myTripsTitle");
    if (myTripsTitle) { myTripsTitle.textContent = t.my_trips_title; }
    const myTripsEmptyList = document.getElementById("myTripsEmptyList");
    if (myTripsEmptyList) { myTripsEmptyList.textContent = t.my_trips_empty_list; }
    document.querySelectorAll(".trip-info-small").forEach(el => {
        const count = el.textContent.match(/\d+/)?.[0] || "0";
        el.textContent = t.my_trips_places.replace("__COUNT__", count);
    });
    document.querySelectorAll(".myTripsDistance").forEach(div => {
        const kmMatch = div.textContent.match(/[\d.]+\s*km/);
        const kmText = kmMatch ? kmMatch[0] : "";
        div.innerHTML = `<strong>${t.my_trips_distance}</strong> ${kmText}`;
    });
    document.querySelectorAll(".myTripsTravelTime").forEach(div => {
        const minMatch = div.textContent.match(/[\d.]+\s*min/);
        const minText = minMatch ? minMatch[0] : "";
        div.innerHTML = `<strong>${t.my_trips_travel_time}</strong> ${minText}`;
    });
    document.querySelectorAll(".myTripsPrice").forEach(div => {
        const priceMatch = div.textContent.match(/[\d.,]+\s*€/) || [];
        const priceText = priceMatch[0] || "";
        div.innerHTML = `<strong>${t.my_trips_price}</strong> ${priceText}`;
    });
    const myTripsMoreDetails = document.getElementById("myTripsMoreDetails");
    if (myTripsMoreDetails) { myTripsMoreDetails.textContent = t.my_trips_more_details; }
}
