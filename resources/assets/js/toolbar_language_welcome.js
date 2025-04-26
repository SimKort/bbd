import { updateTexts } from "./welcome";

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
function setLanguage(lang) {
    localStorage.setItem('preferredLang', lang);
    updateLanguageUI(lang);
    hideLanguageDropdown();
    updateTexts();
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
    const storedLang = localStorage.getItem('preferredLang') || 'lt';
    setLanguage(storedLang);
});
