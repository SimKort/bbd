import './bootstrap';
import { translations } from './translations';

const lang = localStorage.getItem('preferredLang') || 'lt';
const t = translations[lang];

// Užpildytų laukų validacijos funkcija
export function validateAccountFields(t) {
    let valid = true;
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    if (!nameInput.value.trim()) {
        const nameError = document.getElementById('nameError');
        nameError.textContent = t.nameMustExistError;
        nameError.style.display = "block";
        nameInput.classList.add('is-invalid');
        valid = false;
    }
    if (!emailInput.value.trim()) {
        const emailError = document.getElementById('emailError');
        emailError.textContent = t.emailMustExistError;
        emailError.style.display = "block";
        emailInput.classList.add('is-invalid');
        valid = false;
    }
    return valid;
}

// Vartotojo vardo simbolių neviršyjimo validacijos funkcija
export function validateNameLength(name) {
    const nameInput = document.getElementById('name');
    const nameError = document.getElementById('nameError');
    if (name.length > 15) {
        nameError.textContent = t.nameLengthLimitError;
        nameError.style.display = "block";
        nameError.dataset.lengthError = "true";
        if (nameInput) { nameInput.classList.add('is-invalid'); }
    }
    else if (nameError.dataset.lengthError === "true") {
        nameError.textContent = "";
        nameError.style.display = "none";
        delete nameError.dataset.lengthError;
        if (nameInput) { nameInput.classList.remove('is-invalid'); }
    }
}

// El. pašto simbolių neviršyjimo validacijos funkcija
export function validateEmailLength(email) {
    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('emailError');
    if (email.length > 50) {
        emailError.textContent = t.emailLengthLimitError;
        emailError.style.display = "block";
        emailError.dataset.lengthError = "true";
        if (emailInput) { emailInput.classList.add('is-invalid'); }
    }
    else if (emailError.dataset.lengthError === "true") {
        emailError.textContent = "";
        emailError.style.display = "none";
        delete emailError.dataset.lengthError;
        if (emailInput) { emailInput.classList.remove('is-invalid'); }
    }
}

// El. pašto formato validacijos funkcija
export function validateEmailFormat(email) {
    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('emailError');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.length === 0) {
        if (emailError.dataset.formatError === "true") {
            emailError.textContent = "";
            emailError.style.display = "none";
            delete emailError.dataset.formatError;
        }
        if (emailInput) { emailInput.classList.remove('is-invalid'); }
        return;
    }
    if (!emailRegex.test(email)) {
        emailError.textContent = t.emailFormatError;
        emailError.style.display = "block";
        emailError.dataset.formatError = "true";
        if (emailInput) { emailInput.classList.add('is-invalid'); }
    }
    else if (emailError.dataset.formatError === "true") {
        emailError.textContent = "";
        emailError.style.display = "none";
        delete emailError.dataset.formatError;
        if (emailInput) { emailInput.classList.remove('is-invalid'); }
    }
}

// Vartotojo vardo ir el. pašto unikalumo validacijos funkcija
export async function checkFieldUniqueness(url, fieldName, value, errorElementId, errorMessage) {
    const errorElement = document.getElementById(errorElementId);
    const inputElement = document.getElementById(fieldName);
    if (!value.trim()) {
        if (errorElement) {
            errorElement.textContent = "";
            errorElement.style.display = "none";
            if (inputElement) { inputElement.classList.remove('is-invalid'); }
        }
        return true;
    }
    try {
        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken
            },
            body: JSON.stringify({ [fieldName]: value })
        });
        const data = await response.json();
        if (errorElement && !errorElement.dataset.lengthError && !errorElement.dataset.formatError) {
            if (data.exists) {
                errorElement.textContent = errorMessage;
                errorElement.style.display = "block";
                if (inputElement) { inputElement.classList.add('is-invalid'); }
            }
            else {
                errorElement.textContent = "";
                errorElement.style.display = "none";
                if (inputElement) { inputElement.classList.remove('is-invalid'); }
            }
        }
        return !data.exists;
    } catch (error) {
        console.error('Klaida tikrinant laukelį:', error);
        return false;
    }
}

// Esamo slaptažodžio tikrinimo funkcija
export async function checkCurrentPasswordCorrectness(currentPassword) {
    const currentPasswordError = document.getElementById('currentPasswordError');
    try {
        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        const response = await fetch('/check-current-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken
            },
            body: JSON.stringify({ password: currentPassword })
        });
        const data = await response.json();
        if (!data.correct) {
            if (currentPasswordError) {
                currentPasswordError.textContent = translations[localStorage.getItem('preferredLang') || 'lt'].incorrectCurrentPassword;
                currentPasswordError.style.display = "block";
                document.getElementById('current-password').classList.add('is-invalid');
            }
            return false;
        }
        return true;
    }
    catch (error) {
        console.error('Klaida tikrinant seną slaptažodį:', error);
        return false;
    }
}

// Naujo slaptažodžio sudėties validacijos funkcija
export function validateNewPasswords(newPassword, confirmPassword) {
    const newPasswordInput = document.getElementById('new-password');
    const confirmPasswordInput = document.getElementById('new-password-confirm');
    const newPasswordErrorElement = document.getElementById('newPasswordError');
    const confirmPasswordErrorElement = document.getElementById('newPasswordConfirmError');
    let newPasswordTouched = newPassword.length > 0;
    let confirmPasswordTouched = confirmPassword.length > 0;
    if (!newPasswordTouched) {
        if (newPasswordErrorElement) {
            newPasswordErrorElement.textContent = "";
            newPasswordErrorElement.style.display = "none";
        }
        if (confirmPasswordErrorElement) {
            confirmPasswordErrorElement.textContent = "";
            confirmPasswordErrorElement.style.display = "none";
        }
        if (newPasswordInput) { newPasswordInput.classList.remove('is-invalid'); }
        if (confirmPasswordInput) { confirmPasswordInput.classList.remove('is-invalid'); }
        return false;
    }
    let errors = [];
    if (newPassword.length < 8) { errors.push(t.passwordLengthError); }
    if (!/[0-9]/.test(newPassword)) { errors.push(t.passwordNumberError); }
    if (!/[A-Z]/.test(newPassword)) { errors.push(t.passwordCapitalLetterError); }
    if (!/[\W_]/.test(newPassword)) { errors.push(t.passwordSpecialCharacterError); }
    let passwordMismatchError = null;
    if (confirmPasswordTouched && newPassword !== confirmPassword) { passwordMismatchError = t.repeatPasswordMustMatchError; }
    if (newPasswordErrorElement) {
        if (errors.length > 0) {
            newPasswordErrorElement.innerHTML = errors.join("<br>");
            newPasswordErrorElement.classList.add('error-message');
            newPasswordErrorElement.style.display = "block";
            if (newPasswordInput) { newPasswordInput.classList.add('is-invalid'); }
        }
        else {
            newPasswordErrorElement.innerHTML = "";
            newPasswordErrorElement.style.display = "none";
            if (newPasswordInput) { newPasswordInput.classList.remove('is-invalid'); }
        }
    }
    if (confirmPasswordErrorElement) {
        if (passwordMismatchError) {
            confirmPasswordErrorElement.textContent = passwordMismatchError;
            confirmPasswordErrorElement.classList.add('error-message');
            confirmPasswordErrorElement.style.display = "block";
            if (confirmPasswordInput) { confirmPasswordInput.classList.add('is-invalid'); }
        }
        else {
            confirmPasswordErrorElement.textContent = "";
            confirmPasswordErrorElement.style.display = "none";
            if (confirmPasswordInput) { confirmPasswordInput.classList.remove('is-invalid'); }
        }
    }
    return errors.length === 0 && !passwordMismatchError;
}

// Slaptažodžių laukų užpildymo validacijos funkcija
export function validatePasswordsIfAnyFilled() {
    const currentPasswordInput = document.getElementById('current-password');
    const newPasswordInput = document.getElementById('new-password');
    const newPasswordConfirmInput = document.getElementById('new-password-confirm');
    let valid = true;
    const anyPasswordFilled = currentPasswordInput?.value.trim() || newPasswordInput?.value.trim() || newPasswordConfirmInput?.value.trim();
    if (anyPasswordFilled) {
        if (!currentPasswordInput.value.trim()) {
            const error = document.getElementById('currentPasswordError');
            if (error) {
                error.textContent = translations[lang].passwordMustExistError;
                error.style.display = 'block';
            }
            currentPasswordInput.classList.add('is-invalid');
            valid = false;
        }
        if (!newPasswordInput.value.trim()) {
            const error = document.getElementById('newPasswordError');
            if (error) {
                error.textContent = translations[lang].passwordMustExistError;
                error.style.display = 'block';
            }
            newPasswordInput.classList.add('is-invalid');
            valid = false;
        }
        if (!newPasswordConfirmInput.value.trim()) {
            const error = document.getElementById('newPasswordConfirmError');
            if (error) {
                error.textContent = translations[lang].repeatPasswordMustExistError;
                error.style.display = 'block';
            }
            newPasswordConfirmInput.classList.add('is-invalid');
            valid = false;
        }
    }
    return valid;
}
