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
    <link rel="stylesheet" href="{{ asset('css/show.css') }}">
</head>

@php
    /*use Carbon\CarbonInterval;
    $durationFormatted = $trip->duration >= 60
        ? CarbonInterval::minutes($trip->duration)->cascade()->forHumans(['short' => true, 'parts' => 2])
        : $trip->duration . ' min';*/
@endphp

<body>
@include('components.toolbar')

<div class="container">
    <div class="top-links">
        <a href="{{ route('trips.index') }}" id="savedTripBackLink" class="back-link">← Grįžti į kelionių sąrašą</a>
        <a href="{{ route('map') }}?trip_id={{ $trip->id }}" id="savedTripEditLink" class="edit-link">✏️ Redaguoti</a>
        <a href="#" id="savedTripDeleteLink" class="delete-link" onclick="event.preventDefault(); openDeleteModal({{ $trip->id }});">🗑️ Ištrinti</a>
    </div>

    <div class="trip-title-box">
        <h1>{{ $trip->mode === 'WALKING' ? '🚶‍♂️' : '🚗' }} {{ $trip->title }}</h1>
    </div>

    <div class="trip-layout">
        <div class="trip-plan-column">
            <div class="trip-plan" id="trip-plan-section">
                <div class="trip-header-row">
                    <h3 id="savedTripPlanTitle">Kelionės planas:</h3>
                </div>

                <ul id="trip-plan-list">
                    <li class="start-point">
                        <div class="place-row">
                            <div class="place-left">
                                <span class="plan-icon">🏁</span>
                                <span id="savedTripPlanStart" class="plan-number">Pradžios taškas:</span>
                                <span class="place-name">{{ $trip->start_name }}</span>
                            </div>
                        </div>

                        <div class="plan-address-row">
                            <div class="plan-address">{{ $trip->start_address }}</div>
                        </div>
                    </li>

                    @foreach ($trip->places->sortBy('order') as $i => $place)
                        <li>
                            <div class="place-row">
                                <div class="place-left">
                                    @php
                                        $iconMap = [
                                            'tourist_attraction' => '📍',
                                            'museum' => '🏛️',
                                            'art_gallery' => '🖼️',
                                            'park' => '🌳',
                                            'natural_feature' => '⛰️',
                                            'zoo' => '🦁',
                                            'aquarium' => '🐠',
                                            'amusement_park' => '🎢',
                                            'church' => '⛪',
                                            'hindu_temple' => '🛕',
                                            'synagogue' => '🕍',
                                        ];
                                        $icon = $iconMap[$place->type ?? 'tourist_attraction'] ?? '📍';
                                    @endphp
                                    <span class="plan-icon">{{ $icon }}</span>
                                    <span class="plan-number">{{ $i + 1 }}.</span>
                                    <span class="place-name">{{ $place->name }}</span>
                                </div>

                                @if ($place->price)
                                    <div class="place-price">
                                        💶 {{ number_format($place->price, 2) }} €
                                    </div>
                                @endif

                            </div>
                            <div class="plan-address-row">
                                <div class="plan-address">{{ $place->address }}</div>
                            </div>
                        </li>
                    @endforeach

                    <li class="end-point">
                        <div class="place-row">
                            <div class="place-left">
                                <span class="plan-icon">🎯</span>
                                <span id="savedTripPlanFinish" class="plan-number">Pabaigos taškas:</span>
                                <span class="place-name">{{ $trip->end_name }}</span>
                            </div>
                        </div>

                        <div class="plan-address-row">
                            <div class="plan-address">{{ $trip->end_address }}</div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>

        <div class="trip-map-column">
            <div class="trip-plan" id="trip-plan-section">
                <div class="trip-header-row">
                    <h3 id="savedTripMapTitle">Kelionės žemėlapis:</h3>
                </div>

                <div id="trip-map" style="height: 400px; width: 100%; margin-bottom: 0;"></div>

                <div class="compact-info" id="map-info">
                    <span id="savedTripDistance"><strong>Atstumas:</strong> {{ $trip->distance }} km</span> |




                    <span id="savedTripTime">
  <strong>Numatoma trukmė:</strong>
  <span id="trip-duration" data-minutes="{{ $trip->duration }}"></span>
</span>



                    <span id="savedTripPrice"><strong>Numatoma kaina:</strong> {{ $trip->price_total }} €</span>
                </div>
            </div>

            <div class="bottom-links">
                <a href="#" onclick="function downloadPdfWithLang(tripId) {
                    const lang = localStorage.getItem('preferredLang') || 'lt';
                    window.location.href = `/trips/${tripId}/download?lang=${lang}`;
                }
                downloadPdfWithLang({{ $trip->id }})" id="saveAsPDF" class="maps-link">
                    📥 Parsisiųsti kaip PDF 📥
                </a>

                <a href="{{ $trip->getGoogleMapsLink() }}" target="_blank" id="googleMapsBtn" class="maps-link">
                    🗺️ Atidaryti Google Maps 🗺️
                </a>
            </div>
        </div>
    </div>
</div>

<div id="delete-modal" class="confirm-modal" style="display: none;">
    <div class="confirm-modal-content">
        <p id="delete-modal-text">Ar tikrai norite ištrinti šią kelionę?</p>
        <div class="confirm-buttons">
            <form id="delete-form" method="POST" style="margin: 0;">
                @csrf
                @method('DELETE')
                <button type="submit" id="confirm-trip-title">Ištrinti</button>
            </form>
            <button id="cancel-trip-title" type="button">Atšaukti</button>
        </div>
    </div>
</div>

<script>
    const placeTypeIcons = {
        tourist_attraction: "📍",
        museum: "🏛️",
        art_gallery: "🖼️",
        park: "🌳",
        natural_feature: "⛰️",
        zoo: "🦁",
        aquarium: "🐠",
        amusement_park: "🎢",
        church: "⛪",
        hindu_temple: "🛕",
        synagogue: "🕍"
    };
    window.tripData = {
        start_lat: {{ $trip->start_lat }},
        start_lng: {{ $trip->start_lng }},
        end_lat: {{ $trip->end_lat }},
        end_lng: {{ $trip->end_lng }},
        mode: "{{ $trip->mode }}",
        places: [
                @foreach ($trip->places->sortBy('order') as $place)
            {
                name: @json($place->name),
                lat: {{ $place->lat }},
                lng: {{ $place->lng }},
                address: @json($place->address),
                type: @json($place->type ?? 'tourist_attraction')
            },
            @endforeach
        ]
    };
</script>

<script src="{{ mix('js/show.js') }}" defer></script>
<script src="{{ mix('js/toolbar_language_show.js') }}" defer></script>
<script defer src="https://maps.googleapis.com/maps/api/js?key={{ config('services.google_maps.key') }}&callback=initTripMap"></script>

</body>
</html>
