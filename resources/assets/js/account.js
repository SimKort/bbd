import './bootstrap';
import { translations } from './translations';
import { validateAccountFields, validateNameLength, validateEmailLength, validateEmailFormat, checkFieldUniqueness, validateNewPasswords, checkCurrentPasswordCorrectness, validatePasswordsIfAnyFilled } from './account_validations';

const updateBtn = document.getElementById('updateAccountBtn');

// Tekstų atnaujinimo pagal vertimus funkcija
export function updateTexts() {
    const lang = localStorage.getItem('preferredLang') || 'lt';
    const t = translations[lang];
    document.title = t.titleAccount;
    const toolbarTitle = document.getElementById("toolbar-title");
    if (toolbarTitle) { toolbarTitle.textContent = t.toolbarTitle; }
    const toolbarSavedRoutes = document.getElementById("saved-routes1");
    if (toolbarSavedRoutes) { toolbarSavedRoutes.textContent = t.savedRoutesList; }
    const toolbarAccount = document.getElementById("accountWindowBtn");
    if (toolbarAccount) { toolbarAccount.textContent = t.userDropdownAccount; }
    const toolbarLogout = document.getElementById("logoutBtn");
    if (toolbarLogout) { toolbarLogout.textContent = t.userDropdownLogout; }
    const accountTitle = document.getElementById('account-title');
    if (accountTitle) { accountTitle.textContent = t.accountTitle; }
    const nameLabel = document.querySelector('label[for="name"]');
    if (nameLabel) { nameLabel.textContent = t.accountName; }
    const emailLabel = document.querySelector('label[for="email"]');
    if (emailLabel) { emailLabel.textContent = t.accountEmail; }
    const currentPasswordLabel = document.querySelector('label[for="current-password"]');
    if (currentPasswordLabel) { currentPasswordLabel.textContent = t.currentPassword; }
    const newPasswordLabel = document.querySelector('label[for="new-password"]');
    if (newPasswordLabel) { newPasswordLabel.textContent = t.newPassword; }
    const newPasswordRepeatLabel = document.querySelector('label[for="new-password-confirm"]');
    if (newPasswordRepeatLabel) { newPasswordRepeatLabel.textContent = t.repeatNewPassword; }
    const saveButton = document.getElementById('updateAccountBtn');
    if (saveButton) { saveButton.textContent = t.updateButton; }
    const deleteButton = document.getElementById('deleteAccountBtn');
    if (deleteButton) { deleteButton.textContent = t.deleteAccountButton; }
    const deleteAccountModalLabel = document.getElementById('deleteAccountModalLabel');
    if (deleteAccountModalLabel) { deleteAccountModalLabel.textContent = t.deleteAccountModalLabel; }
    const deleteAccountText = document.getElementById('deleteAccountText');
    if (deleteAccountText) { deleteAccountText.textContent = t.deleteAccountText; }
    const deleteConfirmBtn = document.getElementById('deleteAccountConfirm');
    if (deleteConfirmBtn) { deleteConfirmBtn.textContent = t.deleteAccountConfirm; }
    const deleteCancelBtn = document.getElementById('deleteAccountCancel');
    if (deleteCancelBtn) { deleteCancelBtn.textContent = t.deleteAccountCancel; }
}

// Paskyros duomenų laukelių patikrinimui
document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById('account-form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const currentPasswordInput = document.getElementById('current-password');
    const newPasswordInput = document.getElementById('new-password');
    const newPasswordConfirmInput = document.getElementById('new-password-confirm');
    const lang = localStorage.getItem('preferredLang') || 'lt';
    const t = translations[lang];
    document.querySelectorAll('input').forEach(input => {
        toggleClearButton(input);
        input.addEventListener('input', () => {
            toggleClearButton(input);
        });
    });
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', () => {
            toggleClearButton(input);
        });
    });
    if (nameInput) {
        nameInput.addEventListener('input', async () => {
            const name = nameInput.value;
            validateNameLength(name);
            if (name.trim().length <= 15) {
                await checkFieldUniqueness(
                    '/check-name-edit',
                    'name',
                    name,
                    'nameError',
                    t.nameTakenError
                );
            }
        });
    }
    if (emailInput) {
        emailInput.addEventListener('input', async () => {
            const email = emailInput.value;
            validateEmailLength(email);
            validateEmailFormat(email);
            const formatError = document.getElementById('emailError').dataset.formatError;
            const lengthError = document.getElementById('emailError').dataset.lengthError;
            if (!formatError && !lengthError) {
                await checkFieldUniqueness(
                    '/check-email-edit',
                    'email',
                    email,
                    'emailError',
                    t.emailTakenError
                );
            }
        });
    }
    if (currentPasswordInput) {
        currentPasswordInput.addEventListener('input', () => {
            const currentPasswordError = document.getElementById('currentPasswordError');
            if (currentPasswordError) {
                currentPasswordError.textContent = '';
                currentPasswordError.style.display = 'none';
            }
            currentPasswordInput.classList.remove('is-invalid');
        });
    }
    if (newPasswordInput) {
        newPasswordInput.addEventListener('input', () => {
            validateNewPasswords(
                newPasswordInput.value,
                newPasswordConfirmInput.value
            );
        });
    }
    if (newPasswordConfirmInput) {
        newPasswordConfirmInput.addEventListener('input', () => {
            validateNewPasswords(
                newPasswordInput.value,
                newPasswordConfirmInput.value
            );
        });
    }
    if (form) {
        form.addEventListener('submit', async function(event) {
            event.preventDefault();
            const validFields = validateAccountFields(t);
            const validPasswords = validatePasswordsIfAnyFilled();
            const currentPassword = currentPasswordInput?.value.trim();
            let currentPasswordCorrect = true;
            if (currentPassword) {
                const hashedCurrentPassword = await hashPassword(currentPassword);
                currentPasswordCorrect = await checkCurrentPasswordCorrectness(hashedCurrentPassword);
                if (!currentPasswordCorrect) {
                    form.style.opacity = "1";
                    document.getElementById('loading-spinner').style.display = 'none';
                }
            }
            if (validFields && validPasswords && currentPasswordCorrect) {
                form.style.opacity = "0";
                document.getElementById('loading-spinner').style.display = 'block';
                if (newPasswordInput.value.trim() && !newPasswordInput.dataset.hashed) {
                    const original = newPasswordInput.value;
                    const hashed = await hashPassword(original);
                    newPasswordInput.value = hashed;
                    newPasswordConfirmInput.value = hashed;
                    newPasswordInput.dataset.hashed = "true";
                    newPasswordConfirmInput.dataset.hashed = "true";
                }
                form.submit();
            }
        });
    }
});

// Originalių duomenų ustatymui
const originalValues = {
    name: document.getElementById('name')?.value.trim(),
    email: document.getElementById('email')?.value.trim(),
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
};

// Klaidų išvalymui
['name', 'email', 'current-password', 'new-password', 'new-password-confirm'].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.addEventListener('input', checkFormChanged); }
});

// Laukelių informacijos pakitimo patikrinimo fukcija
function checkFormChanged() {
    const currentValues = {
        name: document.getElementById('name')?.value.trim(),
        email: document.getElementById('email')?.value.trim(),
        currentPassword: document.getElementById('current-password')?.value,
        newPassword: document.getElementById('new-password')?.value,
        confirmPassword: document.getElementById('new-password-confirm')?.value
    };
    const changed =
        currentValues.name !== originalValues.name ||
        currentValues.email !== originalValues.email ||
        currentValues.currentPassword ||
        currentValues.newPassword ||
        currentValues.confirmPassword;
    updateBtn.disabled = !changed;
}

// Slaptažodžio hash'inimui SHA-512 funkcija
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-512', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Įvedimo laukelių valymo funkcija
window.clearInput = function (id) {
    const input = document.getElementById(id);
    if (input) {
        input.value = '';
        toggleClearButton(input);
        input.classList.remove('is-invalid');
        input.focus();
        const generalErrorElement = document.getElementById(id + 'Error') || document.getElementById(id + '-errors');
        if (generalErrorElement) {
            generalErrorElement.textContent = '';
            generalErrorElement.style.display = 'none';
            delete generalErrorElement.dataset.lengthError;
            delete generalErrorElement.dataset.formatError;
        }
        if (id === 'new-password' || id === 'new-password-confirm') {
            const newPasswordError = document.getElementById('newPasswordError');
            const newPasswordConfirmError = document.getElementById('newPasswordConfirmError');
            if (newPasswordError) {
                newPasswordError.textContent = '';
                newPasswordError.style.display = 'none';
            }
            if (newPasswordConfirmError) {
                newPasswordConfirmError.textContent = '';
                newPasswordConfirmError.style.display = 'none';
            }
        }
        if (id === 'current-password') {
            const currentPasswordError = document.getElementById('currentPasswordError');
            if (currentPasswordError) {
                currentPasswordError.textContent = '';
                currentPasswordError.style.display = 'none';
            }
        }
        checkFormChanged();
    }
};

// Laukelio išvalymo mygtuko parodymui arba paslėpimui
window.toggleClearButton = function (input) {
    const wrapper = input.parentElement;
    if (!wrapper) return;
    const clearBtn = wrapper.querySelector('.clear-btn');
    const togglePasswordBtn = wrapper.querySelector('.toggle-password-btn');
    if (clearBtn) { clearBtn.style.display = input.value ? 'inline' : 'none'; }
    if (togglePasswordBtn) { togglePasswordBtn.style.display = input.value ? 'inline' : 'none'; }
};

// Slaptažodžio laukelio parodymo mygtuko parodymui arba paslėpimui
window.togglePassword = function (inputId, toggleButton) {
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

// Toast sėkmingam duomenų pakeitimui
document.addEventListener("DOMContentLoaded", function() {
    const toastEl = document.getElementById('statusToast');
    const toastMessageEl = document.getElementById('toast-message');
    const lang = localStorage.getItem('preferredLang') || 'lt';
    const translations = {
        lt: { toastSuccessUpdate: 'Paskyros informacija sėkmingai atnaujinta.' },
        en: { toastSuccessUpdate: 'Account information updated successfully.' }
    };
    if (toastEl && toastMessageEl) {
        toastMessageEl.textContent = translations[lang].toastSuccessUpdate;
        const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
        toast.show();
    }
});

// Sėkmingo duomenų pakeitimo Toast uždarymas
document.addEventListener("DOMContentLoaded", function() {
    const toastEl = document.getElementById('statusToast');
    if (toastEl) {
        setTimeout(() => {
            const toast = bootstrap.Toast.getOrCreateInstance(toastEl);
            toast.hide();
            window.location.href = '/map';
        }, 3000);
    }
});
