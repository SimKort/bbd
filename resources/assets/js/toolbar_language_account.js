import { updateTexts } from "./account";

export let currentLanguage = localStorage.getItem('preferredLang') || 'lt';

// Kalbos pasirinkimo išskleidžiamojo meniu funkcija
export function toggleLanguageDropdown() {
    const dropdown = document.getElementById('language-dropdown');
    if (dropdown) {
        const dropdownUser = document.getElementById('user-dropdown');
        if (dropdownUser){
            dropdownUser.classList.remove('show');
        }
        dropdown.classList.toggle('show');
    }
}
window.toggleLanguageDropdown = toggleLanguageDropdown;

// Kalbos pasirinkimo nustatymo funkcija
function setLanguage(lang) {
    localStorage.setItem('preferredLang', lang);
    location.reload();
}
window.setLanguage = setLanguage;

// UI kalbos atnaujinimo pagal pasirinktą kalbą funkcija
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

// Kalbos pasirinkimo išskleidžiamojo meniu uždarymas paspaudus už ribų
document.addEventListener('click', (e) => {
    if (!e.target.closest('.language-selector')) {
        const dropdown = document.getElementById('language-dropdown');
        if (dropdown){
            dropdown.classList.remove('show');
        }
    }
});

// Puslapio įkrovimo metu pritaikoma kalba
window.addEventListener('DOMContentLoaded', () => {
    const storedLang = localStorage.getItem('preferredLang') || 'lt';
    updateLanguageUI(storedLang);
    hideLanguageDropdown();
    updateTexts();
});

// Paskyros išskleidžiamojo meniu parodymo funkcija
function toggleUserDropdown() {
    const dropdown = document.getElementById('user-dropdown');
    if (dropdown) {
        dropdown.classList.toggle('show');
    }
}
window.toggleUserDropdown = toggleUserDropdown;

// Uždaryti paskyros išskleidžiamąjį meniu paspaudus kitur
document.addEventListener('click', (e) => {
    if (!e.target.closest('.user-menu')) {
        const dropdown = document.getElementById('user-dropdown');
        if (dropdown){
            dropdown.classList.remove('show');
        }
    }
});
