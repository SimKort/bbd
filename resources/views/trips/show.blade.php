<!DOCTYPE html>
<html lang="lt">
<head>
    <meta charset="UTF-8">
    <link rel="icon" href="data:image/svg+xml,
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 100'>
<text x='10' y='90' font-size=%2290%22>🌍</text></svg>">
    <title>{{ $trip->title }}</title>
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link rel="stylesheet" href="{{ asset('css/toolbar.css') }}">
    <style>
        body {
            font-family: sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f8f8f8;
        }

        .container {
            max-width: 900px;
            margin: auto;
            background: white;
            padding: 20px;
            border-radius: 10px;
        }

        h1 {
            text-align: center;
        }

        .trip-summary {
            margin-bottom: 20px;
        }

        .trip-summary div {
            margin-bottom: 5px;
        }

        .places-list {
            list-style: none;
            padding: 0;
        }

        .place-card {
            border: 1px solid #ccc;
            border-radius: 8px;
            padding: 10px;
            margin-bottom: 10px;
            background-color: #fcfcfc;
        }

        .place-card h4 {
            margin: 0 0 5px 0;
        }

        .back-link {
            display: inline-block;
            margin-top: 20px;
            text-decoration: none;
            color: #007BFF;
            font-weight: bold;
        }

        .back-link:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
@include('components.toolbar')

<div class="container">
    <a href="{{ route('trips.index') }}" class="back-link">← Grįžti į kelionių sąrašą</a>
    <h1>{{ $trip->mode === 'WALKING' ? '🚶‍♂️' : '🚗' }} {{ $trip->title }}</h1>

    <div class="trip-summary">
        <div><strong>Pradžios taškas:</strong> {{ $trip->start_address }}</div>
        <div><strong>Pabaigos taškas:</strong> {{ $trip->end_address }}</div>
        <div><strong>Atstumas:</strong> {{ $trip->distance }} km</div>
        <div><strong>Trukmė:</strong> {{ $trip->duration }} min</div>
        <div><strong>Bendra kaina:</strong> {{ $trip->price_total }} €</div>
    </div>

    <h3>Lankytinos vietos:</h3>
    <ul class="places-list">
        @foreach ($trip->places->sortBy('order') as $place)
            <li class="place-card">
                <h4>{{ $place->name }}</h4>
                <div><strong>Adresas:</strong> {{ $place->address }}</div>
                <div><strong>Koordinatės:</strong> {{ $place->lat }}, {{ $place->lng }}</div>
                @if ($place->price)
                    <div><strong>Kaina:</strong> {{ $place->price }} €</div>
                @endif
            </li>
        @endforeach
    </ul>
    <a href="{{ route('map') }}?trip_id={{ $trip->id }}">✏️ Redaguoti</a>


</div>
</body>
</html>
