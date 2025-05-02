<!DOCTYPE html>
<html lang="lt">

<head>
    <meta charset="UTF-8">
    <link rel="icon" href="data:image/svg+xml,
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 100'>
<text x='10' y='90' font-size=%2290%22>🌍</text></svg>">
    <title>Mano kelionės</title>
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link rel="stylesheet" href="{{ asset('css/toolbar.css') }}">
    <link rel="stylesheet" href="{{ asset('css/trips.css') }}">
</head>

<body>
@include('components.toolbar')

<div class="container">
    <h1 id="myTripsTitle">🧳 Mano kelionės</h1>

    @if ($trips->isEmpty())
        <p id="myTripsEmptyList">Jūs dar nesukūrėte jokių kelionių.</p>
    @else
        <ul class="trip-list">
            @foreach ($trips as $trip)
                <li class="trip-card">
                    @php
                        $emoji = $trip->mode === 'WALKING' ? '🚶‍♂️' : '🚗';
                    @endphp

                    <h3 class="trip-title">{{ $trip->title }} {{ $emoji }}</h3>

                    <div class="trip-route-row">
                        <div class="trip-address">{{ $trip->start_name }}</div>
                        <div class="trip-arrow">→</div>
                        <div class="trip-address">{{ $trip->end_name }}</div>
                    </div>

                    <div class="trip-info-small">
                        (Lankytinos vietos: {{ $trip->places_count }})
                    </div>

                    <div class="trip-stats-row">
                        <div class="myTripsDistance"><strong>Maršruto atstumas:</strong> {{ $trip->distance }} km</div>
                        <div class="myTripsTravelTime"><strong>Maršruto kelionės trukmė:</strong> {{ $trip->duration }} min</div>
                        <div class="myTripsPrice"><strong>Apytikslė bendra kaina:</strong> {{ $trip->price_total }} €</div>
                    </div>

                    <a href="{{ route('trips.show', $trip->id) }}" id="myTripsMoreDetails" class="trip-view-link">👁️ Peržiūrėti</a>
                </li>

            @endforeach
        </ul>
    @endif
</div>

<script src="{{ mix('js/toolbar_language_trips.js') }}"></script>
<script src="{{ mix('js/trips.js') }}"></script>

</body>
</html>
