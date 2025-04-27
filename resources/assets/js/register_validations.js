import './bootstrap';
import { translations } from './translations';

const lang = localStorage.getItem('preferredLang') || 'lt';
const t = translations[lang];

// Vartotojo vardo simbolių neviršyjimo validacijos funkcija
export function validateNameLength(name) {
    const nameInput = document.getElementById('name');
    const nameError = document.getElementById('nameError');
    if (name.length > 15) {
        nameError.textContent = t.nameLengthLimitError;
        nameError.style.display = "block";
        nameError.dataset.lengthError = "true";
        if (nameInput) {
            nameInput.classList.add('is-invalid');
        }
    }
    else if (nameError.dataset.lengthError === "true") {
        nameError.textContent = "";
        nameError.style.display = "none";
        delete nameError.dataset.lengthError;
        if (nameInput) {
            nameInput.classList.remove('is-invalid');
        }
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
        if (emailInput) {
            emailInput.classList.add('is-invalid');
        }
    }
    else if (emailError.dataset.lengthError === "true") {
        emailError.textContent = "";
        emailError.style.display = "none";
        delete emailError.dataset.lengthError;
        if (emailInput) {
            emailInput.classList.remove('is-invalid');
        }
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
    }
    catch (error) {
        console.error('Klaida tikrinant laukelį:', error);
        return false;
    }
}

// Slaptažodžio sudėties validacijos funkcija
export function validatePassword(password, confirmPassword) {
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('password-confirm');
    const passwordErrorElement = document.getElementById('password-errors');
    const confirmPasswordErrorElement = document.getElementById('confirm-password-errors');
    let passwordTouched = password.length > 0;
    let confirmPasswordTouched = confirmPassword.length > 0;
    if (!passwordTouched) {
        if (passwordErrorElement) {
            passwordErrorElement.textContent = "";
            passwordErrorElement.style.display = "none";
        }
        if (confirmPasswordErrorElement) {
            confirmPasswordErrorElement.textContent = "";
            confirmPasswordErrorElement.style.display = "none";
        }
        if (passwordInput) { passwordInput.classList.remove('is-invalid'); }
        if (confirmPasswordInput) { confirmPasswordInput.classList.remove('is-invalid'); }
        return false;
    }
    let errors = [];
    if (password.length < 8) { errors.push(t.passwordLengthError); }
    if (!/[0-9]/.test(password)) { errors.push(t.passwordNumberError); }
    if (!/[A-Z]/.test(password)) { errors.push(t.passwordCapitalLetterError); }
    if (!/[\W_]/.test(password)) { errors.push(t.passwordSpecialCharacterError); }
    let passwordMismatchError = null;
    if (confirmPasswordTouched && password !== confirmPassword) { passwordMismatchError = t.repeatPasswordMustMatchError; }
    if (passwordErrorElement) {
        if (errors.length > 0) {
            passwordErrorElement.innerHTML = errors.join("<br>");
            passwordErrorElement.classList.add('error-message');
            passwordErrorElement.style.display = "block";
            if (passwordInput) { passwordInput.classList.add('is-invalid'); }
        }
        else {
            passwordErrorElement.innerHTML = "";
            passwordErrorElement.style.display = "none";
            if (passwordInput) { passwordInput.classList.remove('is-invalid'); }
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

// Užpildytų laukų validacijos funkcija
export function validateRequiredFields() {
    let valid = true;
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('password-confirm');
    if (nameInput && !nameInput.value.trim()) {
        nameInput.classList.add('is-invalid');
        document.getElementById('nameError').textContent = t.nameMustExistError;
        document.getElementById('nameError').style.display = "block";
        valid = false;
    }
    if (emailInput && !emailInput.value.trim()) {
        emailInput.classList.add('is-invalid');
        document.getElementById('emailError').textContent = t.emailMustExistError;
        document.getElementById('emailError').style.display = "block";
        valid = false;
    }
    if (passwordInput && !passwordInput.value.trim()) {
        passwordInput.classList.add('is-invalid');
        document.getElementById('password-errors').textContent = t.passwordMustExistError;
        document.getElementById('password-errors').style.display = "block";
        valid = false;
    }
    if (confirmPasswordInput && !confirmPasswordInput.value.trim()) {
        confirmPasswordInput.classList.add('is-invalid');
        document.getElementById('confirm-password-errors').textContent = t.repeatPasswordMustExistError;
        document.getElementById('confirm-password-errors').style.display = "block";
        valid = false;
    }
    return valid;
}
