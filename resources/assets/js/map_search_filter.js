import { translations } from "./translations";
import { currentLanguage } from "./toolbar_language_map";

const allPlaceTypes = [
    { value: "tourist_attraction", label: "Lankytini objektai" },
    { value: "museum", label: "Muziejai" },
    { value: "art_gallery", label: "Galerijos" },
    { value: "park", label: "Parkai" },
    { value: "natural_feature", label: "Gamtos objektai" },
    { value: "zoo", label: "Zoologijos sodai" },
    { value: "aquarium", label: "Akvariumai" },
    { value: "amusement_park", label: "Pramogų parkai" },
    { value: "church", label: "Bažnyčios" },
    { value: "hindu_temple", label: "Šventyklos" },
    { value: "synagogue", label: "Sinagogos" }
];

// Filtravimo iškleidžiamojo laukelio funkcija
function toggleDropdown() {
    const dropdown = document.getElementById("place-type-dropdown");
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
}
window.toggleDropdown = toggleDropdown;

// Filtravimo visų pasirinkimų pažymėjimo ir atžymėjimo funkcija
export function selectAllTypes(btn) {
    const checkboxes = document.querySelectorAll('#place-type-checkboxes input[type="checkbox"]');
    const allChecked = Array.from(checkboxes).every(cb => cb.checked);
    if (allChecked) {
        checkboxes.forEach(cb => cb.checked = false);
    }
    else {
        checkboxes.forEach(cb => cb.checked = true);
    }
    updateSelectAllButtonText();
}
window.selectAllTypes = selectAllTypes;

// Filtravimo visų pasirinkimų pažymėjimo ir atžymėjimo mygtuko atnaujinimo funkcija
export function updateSelectAllButtonText() {
    const t = translations[currentLanguage];
    const btn = document.querySelector('.deselect-all-button');
    const checkboxes = document.querySelectorAll('#place-type-checkboxes input[type="checkbox"]');
    if (!btn || checkboxes.length === 0){
        return;
    }
    const allChecked = Array.from(checkboxes).every(cb => cb.checked);
    if (allChecked) {
        btn.innerHTML = `${t.uncheking}`;
        btn.classList.remove("selecting");
    }
    else {
        btn.innerHTML = `${t.checking}`;
        btn.classList.add("selecting");
    }
}

// Lankytinų vietų filtrų pažymejimo elemento sukūrimo funkcija
function createCheckboxElement(type) {
    const wrapper = document.createElement("label");
    wrapper.style.display = "flex";
    wrapper.style.justifyContent = "flex-start";
    wrapper.style.alignItems = "center";
    wrapper.style.margin = "4px 0";
    wrapper.style.padding = "2px 8px";
    wrapper.style.width = "100%";
    wrapper.style.boxSizing = "border-box";
    const text = document.createElement("span");
    text.textContent = translations[currentLanguage][`${type.value}Filter`] || type.label;
    text.style.display = "inline-block";
    text.style.minWidth = "180px";
    text.style.textAlign = "left";
    text.style.marginRight = "8px";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = type.value;
    checkbox.checked = true;
    wrapper.appendChild(text);
    wrapper.appendChild(checkbox);
    return wrapper;
}

// Filtravimo masyvo sukūrimo funkcija
function generatePlaceTypeCheckboxes() {
    const container = document.getElementById("place-type-checkboxes");
    container.innerHTML = "";
    allPlaceTypes.forEach(type => container.appendChild(createCheckboxElement(type)));
    const checkboxes = container.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(cb => {
        cb.addEventListener('change', updateSelectAllButtonText);
    });
    updateSelectAllButtonText();
}
window.addEventListener("load", generatePlaceTypeCheckboxes);

// Uždaro filtrų išskleidžiamąjį meniu, paspaudus už jo ribų
document.addEventListener("click", function (event) {
    const dropdown = document.getElementById("place-type-dropdown");
    const button = event.target.closest("button");
    if (!event.target.closest("#place-type-dropdown") &&
        !event.target.closest("button[onclick='toggleDropdown()']")) {
        dropdown.style.display = "none";
    }
});
