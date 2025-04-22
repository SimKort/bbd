import { reinitializeAutocompletes, updateTexts, loadGoogleMapsApi } from './map';

// Pradinio tašo ar tikslo įvesties laukelio išvalymui
window.clearInput = function (id) {
    const input = document.getElementById(id);
    if (input) {
        input.value = '';
        toggleClearButton(input);
        input.focus();
    }
};

// Rodo arba paslepia pradinio tašo ar tikslo laukelio išvalymo mygtuką priklausomai nuo įvesties laukelio turinio
window.toggleClearButton = function (input) {
    const nextBtn = input.nextElementSibling;
    if (nextBtn && nextBtn.classList.contains('clear-btn')) {
        nextBtn.style.display = input.value ? 'inline' : 'none';
    }
};

// Užkrauna Google Maps API, atnaujina tekstus ir automatinį užpildymą, bei atstato išsaugotus laukelių duomenis iš localStorage
document.addEventListener("DOMContentLoaded", () => {
    loadGoogleMapsApi(() => {
        updateTexts();
        reinitializeAutocompletes();
        document.getElementById('start').value = localStorage.getItem('startLocation') || '';
        document.getElementById('end').value = localStorage.getItem('endLocation') || '';
        toggleClearButton(document.getElementById('start'));
        toggleClearButton(document.getElementById('end'));
        document.getElementById('mode').value = localStorage.getItem('travelMode') || 'DRIVING';
        document.getElementById('radius-input').value = localStorage.getItem('radius') || 1000;
        document.getElementById('custom-place').value = localStorage.getItem('customPlace') || '';
        localStorage.removeItem('startLocation');
        localStorage.removeItem('endLocation');
        localStorage.removeItem('travelMode');
        localStorage.removeItem('radius');
        localStorage.removeItem('customPlace');
    });
});
