import { placesService } from "./map";
import { addedWaypoints } from "./map_route_creation";
import { suggestedPlaces } from "./map_find_attractions";
import { renderSuggestedPlaces } from "./map_suggested_places";

// Norimos vietos pridėjimo funkcija
export function addCustomPlace() {
    const input = document.getElementById("custom-place");
    const placeName = input.value.trim();
    if (!placeName){
        return;
    }
    placesService.findPlaceFromQuery({
        query: placeName,
        fields: ['name', 'geometry', 'place_id', 'types']
    }, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results[0]) {
            handleCustomPlaceResult(results[0]);
        }
    });
}
window.addCustomPlace = addCustomPlace;

// Vietos sąraše arba plane patikrinimo funkcija
function handleCustomPlaceResult(result) {
    if (suggestedPlaces.some(p => p.place_id === result.place_id)) {
        alert("Ši vieta jau yra siūlomų sąraše!");
        clearInput2();
        return;
    }
    if (addedWaypoints.some(p => p.place_id === result.place_id)) {
        alert("Ši vieta jau yra kelionės plane!");
        clearInput2();
        return;
    }
    const newPlace = createCustomPlaceObject(result);
    suggestedPlaces.push(newPlace);
    document.getElementById("custom-place").value = "";
    renderSuggestedPlaces();
    const title = document.getElementById("suggested-title");
    if (title){
        title.style.display = "block";
    }
}

// Vietos objekto sukūrimo funkcija
function createCustomPlaceObject(result) {
    return {
        name: result.name,
        location: result.geometry.location,
        place_id: result.place_id,
        cost: 0,
        type: result.types?.[0] || "tourist_attraction"
    };
}

// Veitos paieškos įvesties laukelio išvalymo funkcija
export function clearInput2() {
    const input = document.getElementById("custom-place");
    input.value = "";
    toggleClear2Button(input);
    input.focus();
}
window.clearInput2 = clearInput2;

// Vietos paieškos laukelio išvalymo mygtuko rodymo arba paslėpimo funkcija
export function toggleClear2Button(input) {
    const nextBtn = input.nextElementSibling;
    if (nextBtn && nextBtn.classList.contains('clear-search-btn')) {
        nextBtn.style.display = input.value ? 'inline' : 'none';
    }
}
window.toggleClear2Button = toggleClear2Button;
