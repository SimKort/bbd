import {addedWaypoints, getEndMarker, getStartMarker} from "./map_route_creation";
import {getFuelData} from "./map_fuel_price";
import {getCurrentEndName, getCurrentStartName} from "./map_trip_places";

// Neprisijungusio naudotojo laikino duomenų saugojimo funkcija
function generateTripPayload() {
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
        const name = item.querySelector('.trip-place-name')?.innerText.replace(/\u20ac/g, '').trim() || '';
        const type = item.dataset.type || 'tourist_attraction';
        const address = item.querySelector('.trip-place-address')?.innerText || '';
        const price = parseFloat(item.dataset.price || 0);
        const lat = parseFloat(item.dataset.lat);
        const lng = parseFloat(item.dataset.lng);
        const website = addedWaypoints.find(p => p.place_id === placeId)?.website || null;
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
                website,
            });
        }
    });
    const fuelData = getFuelData();
    if (mode === "WALKING") {
        fuelData.fuel_type = null;
        fuelData.fuel_price = null;
        fuelData.fuel_consumption = null;
    }
    return {
        title: document.getElementById("trip-title-input")?.value || "Mano kelionė",
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
        mode,
        fuel_type: fuelData.fuel_type,
        fuel_price: isNaN(fuelData.fuel_price) ? null : fuelData.fuel_price,
        fuel_consumption: isNaN(fuelData.fuel_consumption) ? null : fuelData.fuel_consumption,
        places,
    };
}

// Neprisijungusio vartotojo išsaugojimo mygtuko paspaudimo funkcija
function handleGuestSave() {
    const payload = generateTripPayload();
    localStorage.setItem('temporaryTrip', JSON.stringify(payload));
    showGuestRestrictionModal();
}
window.handleGuestSave = handleGuestSave;

// Modal prisijungti ar registruotis parodymo funkcija
function showGuestRestrictionModal() {
    document.getElementById("guest-restriction-modal").style.display = "block";
}

// Modal prisijungti ar registruotis uždarymo funkcija
function closeGuestRestrictionModal() {
    document.getElementById("guest-restriction-modal").style.display = "none";
}
window.closeGuestRestrictionModal = closeGuestRestrictionModal;

// Modal prisijungti ar registruotis uždarymui paspaudus už jo ribų
window.addEventListener("click", function (event) {
    const modal = document.getElementById("guest-restriction-modal");
    if (event.target === modal) {
        closeGuestRestrictionModal();
    }
});

// Po prisijungimo arba registracijos (pavyzdžiui, puslapio /trips krovime)
window.addEventListener("DOMContentLoaded", () => {
    const saved = localStorage.getItem('temporaryTrip');
    if (saved) {
        const data = JSON.parse(saved);
        fetch('/trips', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
            },
            body: JSON.stringify(data),
        })
            .then(res => res.json())
            .then(json => {
                if (json.success) {
                    localStorage.removeItem('temporaryTrip');
                    window.location.href = '/trips';
                }
            });
    }
});
