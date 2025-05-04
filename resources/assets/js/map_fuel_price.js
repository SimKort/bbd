import { currentLanguage } from './toolbar_language_map';
import { translations } from './translations';
import { setFuelModalShown } from './map_route_creation';
import { totalObjectCost } from './map_price_popup';
import "./map_trip_places";

let fuelConsumption = 6, fuelPrices = {}, startCountryCode = null, fuelType = "gasoline", userFuelPrice = null, totalFuelCost = 0, fuelModalWasConfirmed = false;

export function setFuelModalWasConfirmed(value) {
    fuelModalWasConfirmed = value;
}
window.setFuelModalWasConfirmed = setFuelModalWasConfirmed;

// Užkrauname degalų kainas iš JSON failo
fetch('/data/fuel_prices.json')
    .then(response => response.json())
    .then(data => {
        fuelPrices = {};
        data.forEach(entry => {
            if (entry.code) {
                fuelPrices[entry.code.toUpperCase()] = {
                    gasoline: entry['gasoline price'],
                    diesel: entry['diesel price']
                };
            }
        });
        updateFuelCost();
    })
    .catch(err => console.error('Nepavyko užkrauti degalų kainų:', err));

// Degalų nustatymų langelio valdymas
window.addEventListener("DOMContentLoaded", () => {
    document.getElementById("fuel-cost-button").onclick = () => {
        document.getElementById("fuel-cost-modal").style.display = "block";
        updateTooltip();
    };
    document.getElementById("cancel-fuel").onclick = () => {
        document.getElementById("fuel-cost-modal").style.display = "none";
    };
    document.getElementById("confirm-fuel").onclick = () => {
        const input = parseFloat(document.getElementById("fuel-input").value);
        const customPrice = parseFloat(document.getElementById("fuel-price-input")?.value);
        const fuelTypeRadio = document.querySelector('input[name="fuel-type"]:checked');
        const inputTypeRadio = document.querySelector('input[name="fuel-input"]:checked');
        if (!isNaN(input) && input > 0) {
            fuelConsumption = input;
            fuelType = fuelTypeRadio?.value || "gasoline";
            userFuelPrice = inputTypeRadio?.value === "custom" && !isNaN(customPrice) ? customPrice : null;
            fuelModalWasConfirmed = true;
            updateFuelCost();
            document.getElementById("fuel-cost-modal").style.display = "none";
        }
    };
    document.querySelectorAll('input[name="fuel-input"]').forEach(radio => {
        radio.addEventListener("change", () => {
            const customWrapper = document.getElementById("custom-price-wrapper");
            customWrapper.style.display = radio.value === "custom" ? "block" : "none";
        });
    });
});
document.getElementById("fuel-close").onclick = () => {
    document.getElementById("fuel-cost-modal").style.display = "none";
};

// Šalies kodo nustatymo iš kito failo funkcija
export function setFuelStartCountry(countryCode) {
    startCountryCode = countryCode?.trim().toUpperCase() || null;
}
window.setFuelStartCountry = setFuelStartCountry;

// Degalų kainos apskaičiavimo funkcija
export function updateFuelCost() {
    const distanceText = document.getElementById("distance")?.textContent;
    const distanceKm = parseFloat(distanceText);
    if (!isNaN(distanceKm)) {
        const fuelUsed = (fuelConsumption / 100) * distanceKm;
        let pricePerLiter = userFuelPrice;
        if (!userFuelPrice && startCountryCode && fuelPrices[startCountryCode]) {
            pricePerLiter = fuelPrices[startCountryCode][fuelType] || fuelPrices[startCountryCode].gasoline;
        }
        if (!isNaN(pricePerLiter)) {
            totalFuelCost = fuelUsed * pricePerLiter;
        }
        else {
            totalFuelCost = 0;
        }
        updateTotalCombinedCost();
    }
    updateTooltip();
}

// Degalų nustatymų patvirtinimas
document.getElementById("confirm-fuel").onclick = () => {
    const input = parseFloat(document.getElementById("fuel-input").value);
    const customPrice = parseFloat(document.getElementById("fuel-price-input")?.value);
    const fuelTypeRadio = document.querySelector('input[name="fuel-type"]:checked');
    const inputTypeRadio = document.querySelector('input[name="fuel-input"]:checked');
    if (!isNaN(input) && input > 0) {
        fuelConsumption = input;
        fuelType = fuelTypeRadio?.value || "gasoline";
        userFuelPrice = inputTypeRadio?.value === "custom" && !isNaN(customPrice) ? customPrice : null;
        fuelModalWasConfirmed = true;
        updateFuelCost();
        document.getElementById("fuel-cost-modal").style.display = "none";
    }
};

// Mygtuko skirto degalų nustatymams rodymo funkcija
function toggleFuelButtonVisibility(mode) {
    const fuelBtn = document.getElementById("fuel-cost-button");
    if (mode === "WALKING") {
        fuelBtn.style.display = "none";
    }
    else {
        fuelBtn.style.display = "inline-flex";
    }
}

// pakeitus keliavimo tipą į pėščiomis išminusuojama degalų kainą
document.getElementById("mode").addEventListener("change", function (e) {
    const selectedMode = e.target.value;
    window.currentTravelMode = selectedMode.toUpperCase();
    toggleFuelButtonVisibility(selectedMode);
    if (window.currentTravelMode !== "DRIVING") {
        setFuelModalShown(false);
        totalFuelCost = 0;
        updateTotalCombinedCost();
    }
});

// Bendros kainos atnaujinimo funkcija
export function updateTotalCombinedCost() {
    const combined = totalObjectCost + totalFuelCost;
    document.getElementById("total-place-cost").textContent = combined.toFixed(2) + " €";
    document.getElementById("total-place-cost-bottom").textContent = combined.toFixed(2) + " €";
}

// Informacinio langelio atnaujinimo funkcija
export function updateTooltip() {
    const tooltipEl = document.getElementById("fuel-tooltip");
    if (!tooltipEl){
        return;
    }
    if (!startCountryCode || !fuelPrices[startCountryCode]) {
        tooltipEl.textContent = translations[currentLanguage].fuel_tooltip_price_not_found;
        return;
    }
    const fuelPrice = fuelPrices[startCountryCode][fuelType];
    if (isNaN(fuelPrice)) {
        tooltipEl.textContent = translations[currentLanguage].fuel_tooltip_not_found;
        return;
    }
    tooltipEl.textContent = translations[currentLanguage].fuel_tooltip_with_data(fuelType, startCountryCode, fuelPrice.toFixed(2));
}

// Informacinio langelio teksto atnaujinimo funkcija
function updateTooltipText() {
    const fuelTypeSelected = document.querySelector('input[name="fuel-type"]:checked')?.value || "gasoline";
    if (!startCountryCode || !fuelPrices[startCountryCode]) {
        document.getElementById("fuel-tooltip").textContent = translations[currentLanguage].fuel_tooltip_price_not_found;
        return;
    }
    const fuelPrice = fuelPrices[startCountryCode][fuelTypeSelected];
    if (isNaN(fuelPrice)) {
        document.getElementById("fuel-tooltip").textContent = translations[currentLanguage].fuel_tooltip_not_found;
        return;
    }
    document.getElementById("fuel-tooltip").textContent = translations[currentLanguage].fuel_tooltip_with_data(
        fuelTypeSelected,
        startCountryCode,
        fuelPrice.toFixed(2)
    );
}

// Pakeitus degalų tipą, pakeičiamas informacinio langelio tekstas
document.querySelectorAll('input[name="fuel-type"]').forEach(radio => {
    radio.addEventListener("change", () => {
        updateTooltipText();
    });
});

// Degalų duomenų išsaugojimo funkcija
export function getFuelData() {
    if (!fuelModalWasConfirmed) {
        return {
            fuel_type: null,
            fuel_price: null,
            fuel_consumption: null,
        };
    }
    return {
        fuel_type: fuelType,
        fuel_price: userFuelPrice ?? (fuelPrices[startCountryCode]?.[fuelType] ?? null),
        fuel_consumption: fuelConsumption,
    };
}
