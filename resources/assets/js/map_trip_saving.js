import { translations } from './translations';
import './map_trip_places';
import { getFuelData } from './map_fuel_price';
import {currentLanguage} from "./toolbar_language_map";

let pendingTripData = null;

// Kelionės plano išsaugojimo funkcija
function saveTrip() {
    const start = document.getElementById('start')?.value || '';
    const end = document.getElementById('end')?.value || '';
    if (!start || !end) {
        alert("Trūksta pradžios ir pabaigos taškų.");
        return;
    }
    pendingTripData = (title) => continueSaveTrip(title, start, end);
    showTripTitleModal();
}
window.saveTrip = saveTrip;

function continueSaveTrip(title, start, end) {
    const mode = document.getElementById("mode").value || "DRIVING";
    const distanceText = document.getElementById('distance-bottom')?.innerText.replace(' km', '') || '0';
    const durationText = document.getElementById('duration-bottom')?.innerText.replace(' min', '') || '0';
    const costText = document.getElementById('total-place-cost-bottom')?.innerText.replace('€', '').trim() || '0';
    const tripItems = document.querySelectorAll('#trip-plan-list li[data-place-id]');
    const places = [];
    tripItems.forEach((item, index) => {
        const placeId = item.dataset.placeId;
        const name = item.querySelector('.trip-place-name')?.innerText || '';
        const address = item.querySelector('.trip-place-address')?.innerText || '';
        const price = parseFloat(item.dataset.price || 0);
        const lat = parseFloat(item.dataset.lat);
        const lng = parseFloat(item.dataset.lng);
        if (placeId && name && address && !isNaN(lat) && !isNaN(lng)) {
            places.push({
                place_id: placeId,
                name,
                address,
                price,
                order: index + 1,
                lat,
                lng,
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
        start_address: start,
        end_address: end,
        distance: parseFloat(distanceText),
        duration: parseInt(durationText),
        price_total: parseFloat(costText),
        mode: mode,
        fuel_type: fuelData.fuel_type,
        fuel_price: isNaN(fuelData.fuel_price) ? null : fuelData.fuel_price,
        fuel_consumption: isNaN(fuelData.fuel_consumption) ? null : fuelData.fuel_consumption,
        places,
    };
    fetch('/trips', {
        method: 'POST',
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

// Kelionės plano išsaugojimo pvadinimo laukelio parodymo funkcija
function showTripTitleModal() {
    const t = translations[currentLanguage];
    document.getElementById("trip-title-modal").style.display = "block";
    document.getElementById("trip-title-input").value = t.save_trip_plan_input;
}

// Patvirtinamas suteiktas pavadinimas
document.getElementById("confirm-trip-title").onclick = () => {
    const titleInput = document.getElementById("trip-title-input").value.trim();
    const t = translations[currentLanguage];
    if (!titleInput) {
        alert(t.save_trip_plan_input_error);
        return;
    }
    document.getElementById("trip-title-modal").style.display = "none";
    if (pendingTripData) {
        pendingTripData(titleInput);
        pendingTripData = null;
    }
};

// Kelionės plano atšaukimas
document.getElementById("cancel-trip-title").onclick = () => {
    document.getElementById("trip-title-modal").style.display = "none";
    pendingTripData = null;
};
