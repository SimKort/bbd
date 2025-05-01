<!DOCTYPE html>
<html lang="lt">
<head>
    <meta charset="UTF-8">
    <link rel="icon" href="data:image/svg+xml,
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 100'>
<text x='10' y='90' font-size=%2290%22>🌍</text></svg>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registracija</title>
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="{{ mix('css/toolbar.css') }}">
    <link rel="stylesheet" href="{{ mix('css/register.css') }}">
</head>
<body>
@include('components.toolbar')
<div class="d-flex justify-content-center align-items-center min-vh-100">
    <div class="register-box p-4 shadow rounded">
        <h2 id="create-account-title" class="mb-4 text-center">Sukurti paskyrą</h2>
        <form method="POST" action="{{ route('register') }}">
            @csrf
            <div class="mb-3">
                <label for="name" class="form-label">Vartotojo vardas</label>
                <div class="input-wrapper">
                    <input id="name" type="text" class="form-control @error('name') is-invalid @enderror"
                           name="name" value="{{ old('name') }}" autocomplete="name" autofocus oninput="toggleClearButton(this)">
                    <button type="button" class="clear-btn" onclick="clearInput('name')">×</button>
                </div>
                <div id="nameError" class="error-message"></div>
                @error('name')
                <div class="invalid-feedback">{{ $message }}</div>
                @enderror
            </div>

            <div class="mb-3">
                <label for="email" class="form-label">El. paštas</label>
                <div class="input-wrapper">
                    <input id="email" type="text" class="form-control @error('email') is-invalid @enderror"
                           name="email" value="{{ old('email') }}" autocomplete="email" oninput="toggleClearButton(this)">
                    <button type="button" class="clear-btn" onclick="clearInput('email')">×</button>
                </div>
                <div id="emailError" class="error-message"></div>
                @error('email')
                <div class="invalid-feedback">{{ $message }}</div>
                @enderror
            </div>

            <div class="mb-3">
                <label for="password" class="form-label">Slaptažodis</label>
                <div class="input-wrapper">
                    <input id="password" type="password" class="form-control @error('password') is-invalid @enderror"
                           name="password" autocomplete="new-password" oninput="toggleClearButton(this)">
                    <button type="button" class="toggle-password-btn" onclick="togglePassword('password', this)">👁</button>
                    <button type="button" class="clear-btn" onclick="clearInput('password')">×</button>
                </div>
                @error('password')
                <div class="invalid-feedback">{{ $message }}</div>
                @enderror
                <div id="password-errors" class="error-message"></div>
            </div>

            <div class="mb-3">
                <label for="password-confirm" class="form-label">Pakartokite slaptažodį</label>
                <div class="input-wrapper">
                    <input id="password-confirm" type="password" class="form-control"
                           name="password_confirmation" autocomplete="new-password" oninput="toggleClearButton(this)">
                    <button type="button" class="toggle-password-btn" onclick="togglePassword('password-confirm', this)">👁</button>
                    <button type="button" class="clear-btn" onclick="clearInput('password-confirm')">×</button>
                </div>
                <div id="confirm-password-errors" class="error-message"></div>
            </div>

            <button id="registerButton" type="submit" class="btn btn-primary w-100">Registruotis</button>
        </form>
        <div class="text-center mt-3">
            <a id="accountExistLink" href="{{ route('login') }}">Jau turite paskyrą? Prisijunkite</a>
        </div>
    </div>
</div>

<div id="loading-spinner" style="display:none; position:fixed; top:50%; left:50%; transform:translate(-50%, -50%);">
    <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden"> </span>
    </div>
</div>

<script src="{{ mix('js/register.js') }}"></script>
<script src="{{ mix('js/toolbar_language_register.js') }}"></script>

</body>
</html>
