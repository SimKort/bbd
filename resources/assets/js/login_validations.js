import './bootstrap';
import { translations } from './translations';

const lang = localStorage.getItem('preferredLang') || 'lt';
const t = translations[lang];

// El. pašto egzistavimo ir slaptažodžio tinkamumo validacijos funkcija
export async function checkLoginCredentials(email, hashedPassword) {
    const lang = localStorage.getItem('preferredLang') || 'lt';
    const t = translations[lang];
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    try {
        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        const response = await fetch('/check-login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken
            },
            body: JSON.stringify({ email, password: hashedPassword })
        });
        const data = await response.json();
        if (!data.exists) {
            if (emailError) {
                emailError.textContent = t.accountDoesNotExist;
                emailError.style.display = "block";
                document.getElementById('email').classList.add('is-invalid');
            }
            return false;
        }
        if (!data.passwordCorrect) {
            if (passwordError) {
                passwordError.textContent = t.incorrectPassword;
                passwordError.style.display = "block";
                document.getElementById('password').classList.add('is-invalid');
            }
            return false;
        }
        return true;
    }
    catch (error) {
        console.error('Klaida tikrinant prisijungimą:', error);
        return false;
    }
}

// Užpildytų laukų validacijos funkcija
export function validateRequiredFields() {
    let valid = true;
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    if (emailInput && !emailInput.value.trim()) {
        emailInput.classList.add('is-invalid');
        document.getElementById('emailError').textContent = t.emailMustExistError;
        document.getElementById('emailError').style.display = "block";
        valid = false;
    }
    if (passwordInput && !passwordInput.value.trim()) {
        passwordInput.classList.add('is-invalid');
        document.getElementById('passwordError').textContent = t.passwordMustExistError;
        document.getElementById('passwordError').style.display = "block";
        valid = false;
    }
    return valid;
}
