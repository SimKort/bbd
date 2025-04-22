import { updateTexts, reinitializeAutocompletes, loadGoogleMapsApi } from './map';

export let currentLanguage = localStorage.getItem('preferredLang') || 'lt';

// Kalbos pasirinkimo išskleidžiamojo meniu funkcija
export function toggleLanguageDropdown() {
    const dropdown = document.getElementById('language-dropdown');
    if (dropdown) {
        dropdown.classList.toggle('show');
    }
}
window.toggleLanguageDropdown = toggleLanguageDropdown;

// Kalbos pasirinkimo nustatymo funkcija
export function setLanguage(lang, skipReload = false) {
    localStorage.setItem('preferredLang', lang);
    updateLanguageUI(lang);
    hideLanguageDropdown();
    if (!skipReload) {
        saveInputsToLocalStorage();
        reloadGoogleMapsWithLang(() => {
            updateTexts();
            reinitializeAutocompletes();
        });
    }
}
window.setLanguage = setLanguage;

// UI kalbos atnaujinimo pagal pasirinktą kalbą funkcija.
function updateLanguageUI(lang) {
    const currentLangElement = document.getElementById('current-language');
    if (currentLangElement){
        currentLangElement.textContent = lang === 'lt' ? 'Lt' : 'En';
    }
    const ltEl = document.getElementById('lang-lt');
    const enEl = document.getElementById('lang-en');
    if (ltEl){
        ltEl.style.fontWeight = lang === 'lt' ? 'bold' : 'normal';
    }
    if (enEl){
        enEl.style.fontWeight = lang === 'en' ? 'bold' : 'normal';
    }
}

// Kalbos išskleidžiamojo meniu uždarymo funkcija
function hideLanguageDropdown() {
    const dropdown = document.getElementById('language-dropdown');
    if (dropdown){
        dropdown.classList.remove('show');
    }
}

// Pagrindinių įvesties laukų duomenų išsaugojimo į localStorage funkcija
function saveInputsToLocalStorage() {
    localStorage.setItem('startLocation', document.getElementById('start').value);
    localStorage.setItem('endLocation', document.getElementById('end').value);
    localStorage.setItem('travelMode', document.getElementById('mode').value);
    localStorage.setItem('radius', document.getElementById('radius-input').value);
    localStorage.setItem('customPlace', document.getElementById('custom-place').value);
}

// Google Maps perkrovimo su pasirinkta kalba funkcija
function reloadGoogleMapsWithLang(callback) {
    const oldScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if(oldScript){
        oldScript.remove();
    }
    loadGoogleMapsApi(callback);
    location.reload();
}

// Kalbos pasirinkimo išskleidžiamojo meniu uždarymas, paspaudus už jo ribų
document.addEventListener('click', (e) => {
    if (!e.target.closest('.language-selector')) {
        const dropdown = document.getElementById('language-dropdown');
        if (dropdown){
            dropdown.classList.remove('show');
        }
    }
});

// Nustato kalbą pagal išsaugotą reikšmę iš localStorage (arba naudoja esamą, jei nėra)
window.addEventListener('DOMContentLoaded', () => {
    const storedLang = localStorage.getItem('preferredLang');
    if (storedLang){
        setLanguage(storedLang, true);
    }
    else{
        setLanguage(currentLanguage, true);
    }
});
