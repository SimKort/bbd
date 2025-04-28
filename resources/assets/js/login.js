import './bootstrap';
import { translations } from './translations';
import {checkLoginCredentials, validateRequiredFields} from './login_validations';

// Tekstų atnaujinimo pagal vertimus funkcija
export function updateTexts() {
    const lang = localStorage.getItem('preferredLang') || 'lt';
    const t = translations[lang];
    document.title = t.titleLogin;
    const toolbarTitle = document.getElementById("toolbar-title");
    if (toolbarTitle) { toolbarTitle.textContent = t.toolbarTitle; }
    const loginTitle = document.getElementById('login-title');
    if (loginTitle) { loginTitle.textContent = t.loginToAccount; }
    const emailLabel = document.querySelector('label[for="email"]');
    if (emailLabel) { emailLabel.textContent = t.accountEmail; }
    const passwordLabel = document.querySelector('label[for="password"]');
    if (passwordLabel) { passwordLabel.textContent = t.accountPassword; }
    const loginButton = document.getElementById('loginButton');
    if (loginButton) { loginButton.textContent = t.loginButton; }
    const registerLink = document.getElementById('accountRegisterLink');
    if (registerLink) { registerLink.textContent = t.noAccountRegister; }
}

// Prisijungimo laukelių patikrinimui
document.addEventListener("DOMContentLoaded", function() {
    const form = document.querySelector('form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    if (emailInput) {
        emailInput.addEventListener('input', () => {
            const emailError = document.getElementById('emailError');
            if (emailError) {
                emailError.style.display = "none";
                emailError.textContent = "";
                emailInput.classList.remove('is-invalid');
            }
        });
    }
    if (passwordInput) {
        passwordInput.addEventListener('input', () => {
            const passwordError = document.getElementById('passwordError');
            if (passwordError) {
                passwordError.style.display = "none";
                passwordError.textContent = "";
                passwordInput.classList.remove('is-invalid');
            }
        });
    }
    if (form) {
        form.addEventListener('submit', async function(event) {
            event.preventDefault();
            clearErrorMessages();
            let requiredFieldsValid = validateRequiredFields();
            if (requiredFieldsValid) {
                form.style.opacity = "0";
                document.getElementById('loading-spinner').style.display = 'block';
                const hashedPassword = await hashPassword(passwordInput.value);
                const loginValid = await checkLoginCredentials(emailInput.value, hashedPassword);
                if (loginValid) {
                    passwordInput.value = hashedPassword;
                    const formData = new FormData(form);
                    try {
                        const response = await fetch(form.action, {
                            method: 'POST',
                            headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content') },
                            body: formData,
                            redirect: "follow"
                        });
                        if (response.ok) { window.location.href = '/map'; }
                        else {
                            console.error('Serverio atsakymas ne OK.');
                            form.style.opacity = "1";
                            document.getElementById('loading-spinner').style.display = 'none';
                        }
                    }
                    catch (error) {
                        console.error('Tinklo klaida:', error);
                        form.style.opacity = "1";
                        document.getElementById('loading-spinner').style.display = 'none';
                    }
                }
                else {
                    form.style.opacity = "1";
                    document.getElementById('loading-spinner').style.display = 'none';
                }
            }
        });
    }
});

// Slaptažodžio hash'inimui SHA-512 funkcija
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-512', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Visų klaidų prieš patvirtinimą išvalymo funkcija
function clearErrorMessages() {
    document.querySelectorAll('.error-message, #passwordError, #emailError').forEach(el => {
        el.style.display = "none";
        el.textContent = "";
    });
}

// Įvedimo laukelių valymo funkcija
window.clearInput = function (id) {
    const input = document.getElementById(id);
    if (input) {
        input.value = '';
        toggleClearButton(input);
        input.focus();
        let errorElement = null;
        if (id === 'email') { errorElement = document.getElementById('emailError'); }
        if (id === 'password') { errorElement = document.getElementById('passwordError'); }
        if (errorElement) {
            errorElement.style.display = "none";
            errorElement.textContent = "";
        }
        input.classList.remove('is-invalid');
    }
};

// Laukelio išvalymo mygtuko parodymui arba paslėpimui
window.toggleClearButton = function (input) {
    const wrapper = input.parentElement;
    const clearBtn = wrapper.querySelector('.clear-btn');
    const togglePasswordBtn = wrapper.querySelector('.toggle-password-btn');
    if (clearBtn) { clearBtn.style.display = input.value ? 'inline' : 'none'; }
    if (togglePasswordBtn) { togglePasswordBtn.style.display = input.value ? 'inline' : 'none'; }
};

// Slaptažodžio laukelio parodymo mygtuko parodymui arba paslėpimui
window.togglePassword = function(inputId, toggleButton) {
    const input = document.getElementById(inputId);
    if (input) {
        if (input.type === "password") {
            input.type = "text";
            toggleButton.textContent = "◡";
        }
        else {
            input.type = "password";
            toggleButton.textContent = "👁";
        }
    }
};
