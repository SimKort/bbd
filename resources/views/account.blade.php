<!DOCTYPE html>
<html lang="lt">

<head>
    <meta charset="UTF-8">
    <link rel="icon" href="data:image/svg+xml,
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 100'>
<text x='10' y='90' font-size=%2290%22>🌍</text></svg>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Paskyros nustatymai</title>
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="{{ asset('css/toolbar.css') }}">
    <link rel="stylesheet" href="{{ asset('css/account.css') }}">
</head>

<body>
@include('components.toolbar')

@if (session('success'))
    <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 9999;">
        <div id="statusToast" class="toast show custom-toast" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex align-items-center p-2">
                <div class="flex-grow-1" id="toast-message"></div>
            </div>
        </div>
    </div>
@endif

<div class="d-flex justify-content-center align-items-center min-vh-100">
    <div class="account-box p-4 shadow rounded">
        <h2 id="account-title" class="mb-4 text-center">Paskyros informacija</h2>
        <form method="POST" action="{{ route('account.update') }}" id="account-form">
            @csrf

            <div class="mb-3">
                <label for="name" class="form-label">Vartotojo vardas</label>
                <div class="input-wrapper">
                    <input id="name" type="text" class="form-control" name="name" value="{{ old('name', auth()->user()->name) }}" oninput="toggleClearButton(this)">
                    <button type="button" class="clear-btn" onclick="clearInput('name')">&times;</button>
                </div>
                <div id="nameError" class="error-message"></div>
            </div>

            <div class="mb-3">
                <label for="email" class="form-label">El. paštas</label>
                <div class="input-wrapper">
                    <input id="email" type="email" class="form-control" name="email" value="{{ old('email', auth()->user()->email) }}" oninput="toggleClearButton(this)">
                    <button type="button" class="clear-btn" onclick="clearInput('email')">&times;</button>
                </div>
                <div id="emailError" class="error-message"></div>
            </div>

            <hr>

            <div class="mb-3">
                <label for="current-password" class="form-label">Dabartinis slaptažodis</label>
                <div class="input-wrapper">
                    <input id="current-password" type="password" class="form-control" name="current_password" oninput="toggleClearButton(this)">
                    <button type="button" class="toggle-password-btn" onclick="togglePassword('current-password', this)">👁</button>
                    <button type="button" class="clear-btn" onclick="clearInput('current-password')">&times;</button>
                </div>
                <div id="currentPasswordError" class="error-message"></div>
            </div>

            <div class="mb-3">
                <label for="new-password" class="form-label">Naujas slaptažodis</label>
                <div class="input-wrapper">
                    <input id="new-password" type="password" class="form-control" name="password" oninput="toggleClearButton(this)">
                    <button type="button" class="toggle-password-btn" onclick="togglePassword('new-password', this)">👁</button>
                    <button type="button" class="clear-btn" onclick="clearInput('new-password')">&times;</button>
                </div>
                <div id="newPasswordError" class="error-message"></div>
            </div>

            <div class="mb-3">
                <label for="new-password-confirm" class="form-label">Pakartoti naują slaptažodį</label>
                <div class="input-wrapper">
                    <input id="new-password-confirm" type="password" class="form-control" name="password_confirmation" oninput="toggleClearButton(this)">
                    <button type="button" class="toggle-password-btn" onclick="togglePassword('new-password-confirm', this)">👁</button>
                    <button type="button" class="clear-btn" onclick="clearInput('new-password-confirm')">&times;</button>
                </div>
                <div id="newPasswordConfirmError" class="error-message"></div>
            </div>

            <button id="updateAccountBtn" type="submit" class="btn btn-primary w-100" disabled>Atnaujinti paskyros duomenis</button>
        </form>

        <hr>

        <div class="text-center">
            <button id="deleteAccountBtn" type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteAccountModal">
                Ištrinti paskyrą
            </button>
        </div>

        <div class="modal fade" id="deleteAccountModal" tabindex="-1" aria-labelledby="deleteAccountModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="deleteAccountModalLabel">Ar tikrai norite ištrinti paskyrą?</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Uždaryti"></button>
                    </div>

                    <div class="modal-body" id="deleteAccountText" >
                        Šis veiksmas negali būti atšauktas. Visi jūsų duomenys bus prarasti.
                    </div>

                    <div class="modal-footer">
                        <form action="{{ route('account.destroy') }}" method="POST">
                            @csrf
                            @method('DELETE')
                            <button id="deleteAccountConfirm" type="submit" class="btn btn-danger">Taip, ištrinti</button>
                        </form>

                        <button id="deleteAccountCancel" type="button" class="btn btn-secondary" data-bs-dismiss="modal">Atšaukti</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<div id="loading-spinner" style="display:none; position:fixed; top:50%; left:50%; transform:translate(-50%, -50%);">
    <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden"> </span>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
<script src="{{ mix('js/account.js') }}"></script>
<script src="{{ mix('js/toolbar_language_account.js') }}"></script>

</body>
</html>
