import './bootstrap';
import { translations } from './translations';

// Tekstų atnaujinimo pagal vertimus funkcija
export function updateTexts() {
    const lang = localStorage.getItem('preferredLang') || 'lt';
    const t = translations[lang];
    const toolbarTitle = document.getElementById("toolbar-title");
    if (toolbarTitle) {toolbarTitle.textContent = t.toolbarTitle;}
    const titleEl = document.getElementById("startModalLabel");
    if (titleEl) titleEl.textContent = t.welcomeModalTitle;
    const loginBtn = document.getElementById("login-button");
    if (loginBtn) loginBtn.textContent = t.login;
    const registerBtn = document.getElementById("register-button");
    if (registerBtn) registerBtn.textContent = t.register;
    const continueLink = document.getElementById("continue-link");
    if (continueLink) continueLink.textContent = t.continueWithoutAccount;
    const smallTitle = document.getElementById("small-title");
    if (smallTitle) smallTitle.textContent = t.smallTitle;
    const smallIntro = document.getElementById("small-intro");
    if (smallIntro) smallIntro.textContent = t.smallIntro;
    const startButton = document.getElementById("start-button");
    if (startButton) startButton.textContent = t.startToChoose;
}
