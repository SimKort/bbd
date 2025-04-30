import './bootstrap';
import { translations } from './translations';
import { validateNameLength, validateEmailLength, checkFieldUniqueness, validateEmailFormat, validatePassword, validateRequiredFields } from './register_validations';

// Tekstų atnaujinimo pagal vertimus funkcija
export function updateTexts() {
    const lang = localStorage.getItem('preferredLang') || 'lt';
    const t = translations[lang];
    document.title = t.titleRegistration;
    const toolbarTitle = document.getElementById("toolbar-title");
    if (toolbarTitle) {toolbarTitle.textContent = t.toolbarTitle;}
    const toolbarAccount = document.getElementById("accountWindowBtn");
    if (toolbarAccount) { toolbarAccount.textContent = t.userDropdownAccount; }
    const toolbarLogout = document.getElementById("logoutBtn");
    if (toolbarLogout) { toolbarLogout.textContent = t.userDropdownLogout; }
    const createAccountTitle = document.getElementById('create-account-title');
    if (createAccountTitle) { createAccountTitle.textContent = t.createAnAccount; }
    const nameLabel = document.querySelector('label[for="name"]');
    if (nameLabel) { nameLabel.textContent = t.accountName; }
    const emailLabel = document.querySelector('label[for="email"]');
    if (emailLabel) { emailLabel.textContent = t.accountEmail; }
    const passwordLabel = document.querySelector('label[for="password"]');
    if (passwordLabel) { passwordLabel.textContent = t.accountPassword; }
    const confirmPasswordLabel = document.querySelector('label[for="password-confirm"]');
    if (confirmPasswordLabel) { confirmPasswordLabel.textContent = t.repeatAccountPassword; }
    const registerButton = document.getElementById('registerButton');
    if (registerButton) { registerButton.textContent = t.registerAccountButton; }
    const accountExistLink = document.getElementById('accountExistLink');
    if (accountExistLink) { accountExistLink.textContent = t.accountExistLogin; }
}

// Registracijos laukelių patikrinimui
document.addEventListener("DOMContentLoaded", function() {
    const lang = localStorage.getItem('preferredLang') || 'lt';
    const t = translations[lang];
    const form = document.querySelector('form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('password-confirm');
    if (nameInput) {
        nameInput.addEventListener('input', async () => {
            validateNameLength(nameInput.value);
            const nameError = document.getElementById('nameError');
            if (!nameError.dataset.lengthError) { await checkFieldUniqueness('/check-username', 'name', nameInput.value, 'nameError', t.nameTakenError); }
        });
    }
    if (emailInput) {
        emailInput.addEventListener('input', async () => {
            validateEmailLength(emailInput.value);
            validateEmailFormat(emailInput.value);
            const emailError = document.getElementById('emailError');
            if (!emailError.dataset.lengthError && !emailError.dataset.formatError) { await checkFieldUniqueness('/check-email', 'email', emailInput.value, 'emailError', t.emailTakenError); }
        });
    }
    if (passwordInput) {
        passwordInput.addEventListener('input', () => {
            validatePassword(passwordInput.value, confirmPasswordInput.value);
        });
    }
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', () => {
            validatePassword(passwordInput.value, confirmPasswordInput.value);
        });
    }
    if (form) {
        form.addEventListener('submit', async function(event) {
            event.preventDefault();
            clearErrorMessages();
            let isValid = validatePassword(passwordInput.value, confirmPasswordInput.value);
            let isNameAvailable = await checkFieldUniqueness('/check-username', 'name', nameInput.value, 'nameError', t.nameTakenError);
            let isEmailAvailable = await checkFieldUniqueness('/check-email', 'email', emailInput.value, 'emailError', t.emailTakenError);
            let requiredFieldsValid = validateRequiredFields();
            if (isValid && isNameAvailable && isEmailAvailable && requiredFieldsValid) {
                form.style.opacity = "0";
                document.getElementById('loading-spinner').style.display = 'block';
                const hashedPassword = await hashPassword(passwordInput.value);
                const hashedConfirmPassword = await hashPassword(confirmPasswordInput.value);
                passwordInput.value = hashedPassword;
                confirmPasswordInput.value = hashedConfirmPassword;
                const formData = new FormData(form);
                try {
                    const response = await fetch(form.action, {
                        method: 'POST',
                        headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content') },
                        body: formData,
                        redirect: "follow"
                    });
                    if (response.ok) {
                        form.submit();
                        window.location.href = '/map';
                    }
                }
                catch (error) { console.error('Tinklo klaida:', error); }
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
    document.querySelectorAll('.error-message, #password-errors, #confirm-password-errors').forEach(el => {
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
        if (id === 'name') checkFieldUniqueness('/check-username', 'name', '', 'nameError', '');
        if (id === 'email') checkFieldUniqueness('/check-email', 'email', '', 'emailError', '');
        if (id === 'password' || id === 'password-confirm') validatePassword(
            document.getElementById('password').value,
            document.getElementById('password-confirm').value
        );
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
