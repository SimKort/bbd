<!DOCTYPE html>
<html>

<head>
    <link rel="stylesheet" href="{{ asset('css/toolbar.css') }}">
    <title>Kelionių planavimas</title>
    <link rel="stylesheet" href="{{ asset('css/map.css') }}">
</head>

<body>
@include('components.toolbar')
<div class="background-image-wrapper" style="background-image: url('{{ asset('images/map_page.png') }}');"></div>
<div class="controls">
    <div class="input-wrapper">
        <input id="start" type="text" placeholder="Įveskite pradžios tašką" oninput="toggleClearButton(this)">
        <button class="clear-btn" onclick="clearInput('start')">×</button>
    </div>

    <div class="input-wrapper">
        <input id="end" type="text" placeholder="Įveskite kelionės tikslą" oninput="toggleClearButton(this)">
        <button class="clear-btn" onclick="clearInput('end')">×</button>
    </div>

    <select id="mode">
        <option value="DRIVING"></option>
        <option value="WALKING"></option>
    </select>

    <div class="filter-wrapper">
        <button onclick="toggleDropdown()">Filtravimas</button>
        <div id="place-type-dropdown">
            <button class="deselect-all-button" onclick="selectAllTypes(this)">❌ Atžymėti visus</button>
            <div id="place-type-checkboxes"></div>
        </div>
    </div>

    <div class="controls-right">
        <div class="tooltip-wrapper">
            <label>Vietos patikimumas pagal atsiliepimus:</label>
            <span class="tooltip-text">Rodomi tik objektai, kurie turi pasirinktą kiekį naudotojų atsiliepimų. Kuo daugiau atsiliepimų, tuo mažesnis šansas gauti netinkamas vietas.</span>
            <select id="rating-threshold">
                <option value="0">Rodyti visus</option>
                <option value="100">Daugiau nei 100</option>
                <option value="250">Daugiau nei 250</option>
                <option value="500" selected>Daugiau nei 500</option>
                <option value="1000">Daugiau nei 1000</option>
            </select>
        </div>

        <div class="tooltip-wrapper">
            <label>Galimas objektų nuotolis (m):</label>
            <span class="tooltip-text">Maksimalus atstumas metrais, kiek objektas gali būti nutolęs nuo kelionės maršruto.</span>
            <input type="number" id="radius-input" value="1000" min="100" max="10000" step="100">
        </div>
    </div>

    <div class="controls-actions-row">
        <div class="controls-actions">
            <button class="route-btn" onclick="calculateRoute()">Rodyti kelionės maršrutą</button>
            <button class="suggest-btn" onclick="requestSuggestedPlaces()">Gauti lankytinų vietų pasiūlymus</button>
        </div>
    </div>
</div>

<div class="map-and-places-container">
    <div class="places-wrapper">
        <div class="places" id="places-section" style="display: none;">
            <h3 id="suggested-title">Lankytinos vietos pakeliui</h3>
            <ul id="suggested-places"></ul>
            <div class="suggested-actions-clear-row" id="suggested-clear-btn-row">
                <button class="clear-suggestions-btn" onclick="showClearSuggestionsModal()">Išvalyti visus pasiūlymus</button>
            </div>

            <div class="search-new-wrapper">
                <h4>Surasti norimą vietą</h4>
                <div class="input-with-clear">
                    <input id="custom-place" type="text" placeholder="Pvz. Trakų salos pilis" oninput="toggleClear2Button(this)">
                    <button class="clear-search-btn" onclick="clearInput2()">×</button>
                </div>
                <button class="add-place-btn" onclick="addCustomPlace()">Surasti</button>
            </div>
        </div>
    </div>

    <div class="map-wrapper">
        <div id="map"></div>
        <div class="compact-info" id="map-info">
            <div class="info-item"><strong>Atstumas:</strong> <span id="distance">-</span></div>
            <div class="info-item"><strong>Numatoma kelionės trukmė:</strong> <span id="duration">-</span></div>
            <div class="info-item"><strong>Numatoma kelionės kaina:</strong> <span id="total-place-cost">-</span></div>
        </div>
    </div>
</div>

<div id="clear-suggestions-modal" class="confirm-modal">
    <div class="confirm-modal-content">
        <p>Ar tikrai norite išvalyti visas pasiūlytas vietas?</p>
        <div class="confirm-buttons">
            <button id="confirm-clear" onclick="confirmClearSuggestions()">Taip</button>
            <button id="cancel-clear" onclick="closeClearSuggestionsModal()">Atšaukti</button>
        </div>
    </div>
</div>

<div id="imageModal" class="modal" onclick="closeImageModal(event)">
    <span class="close" onclick="closeImageModal()">&times;</span>
    <img class="modal-content" id="modalImage">
    <button class="modal-arrow left" onclick="showPreviousImage(event)">&#10094;</button>
    <button class="modal-arrow right" onclick="showNextImage(event)">&#10095;</button>
</div>

<div class="trip-plan" id="trip-plan-section" style="display: none;">
    <h3 id="trip-plan-title">Kelionės planas:</h3>
    <ul id="trip-plan-list"></ul>
    <div class="compact-info" id="bottom-info">
        <span><strong>Atstumas:</strong> <span id="distance-bottom">-</span></span> |
        <span><strong>Numatoma kelionės trukmė:</strong> <span id="duration-bottom">-</span></span> |
        <span><strong>Numatoma kelionės kaina:</strong> <span id="total-place-cost-bottom">0 €</span></span>
    </div>
</div>

<div id="delete-confirm-modal" class="confirm-modal">
    <div class="confirm-modal-content">
        <p class="confirmation-text2">Ar tikrai norite pašalinti šią vietą iš kelionės plano?</p>
        <div class="confirm-buttons">
            <button id="confirm-delete">Taip</button>
            <button id="cancel-delete">Atšaukti</button>
        </div>
    </div>
</div>

<script src="{{ mix('js/toolbar_language.js') }}"></script>
<script src="{{ mix('js/map.js') }}"></script>

<script>
    window.mapApiKey = '{{ config('services.google_maps.key') }}';
</script>

</body>
</html>
