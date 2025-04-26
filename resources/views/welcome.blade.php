<!DOCTYPE html>
<html lang="lt">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kelionių planavimas</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="{{ asset('css/toolbar.css') }}">
    <link rel="stylesheet" href="{{ asset('css/welcome.css') }}">
</head>

<body>
@include('components.toolbar')
<div class="d-flex justify-content-center align-items-center min-vh-100">
    <div class="hero-box">
        <h1 id="small-title" class="mb-3 fs-3">Kelionių planavimo įrankis</h1>
        <p id="small-intro" class="lead mb-4 fw-medium">Planuokite keliones greitai ir patogiai – nuo pradžios iki galo. Viskas vienoje vietoje!</p>
        <button id="start-button" class="start-button" data-bs-toggle="modal" data-bs-target="#startModal">Pradėti</button>
    </div>
</div>

<div class="modal fade" id="startModal" tabindex="-1" aria-labelledby="startModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="startModalLabel">Pasirinkite, kaip norite tęsti</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Uždaryti"></button>
            </div>

            <div class="modal-body text-center">
                <div class="d-flex flex-column gap-3">
                    <a href="/login" id="login-button" class="btn btn-primary w-100">Prisijungti</a>
                    <a href="/register" id="register-button" class="btn btn-outline-primary w-100">Užsiregistruoti</a>
                    <a href="/map" id="continue-link" class="guest-link mt-2">Tęsti be paskyros</a>
                </div>
            </div>
        </div>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
<script src="{{ mix('js/toolbar_language_welcome.js') }}"></script>

</body>
</html>
