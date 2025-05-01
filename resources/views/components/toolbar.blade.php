<header class="toolbar">
    <div class="toolbar-content">
        <a href="/" id="toolbar-title" class="logo">🌍 Kelionių planavimo įrankis</a>

        @if (Auth::check() && Request::is('account*'))
            <div class="saved-routes-button">
                <a href="{{ route('trips.index') }}" id="saved-routes1" class="saved-routes-link">💾 išsaugoti maršrutai 💾</a>
            </div>
        @endif

        @if (Auth::check() && Request::is('map'))
            <div class="saved-routes-button">
                <a href="{{ route('trips.index') }}" id="saved-routes2" class="saved-routes-link">💾 išsaugoti maršrutai 💾</a>
            </div>
        @endif

        @if (Auth::check() && Request::is('trips*'))
        <div class="new-route-button">
                <a href="{{ route('map') }}" id="new-route" class="new-route-link">➕ naujas kelionės planas ➕</a>
            </div>
        @endif

        <div class="toolbar-actions">
            @auth
                <div class="user-menu">
                    <button class="user-button" onclick="toggleUserDropdown()">
                        <span class="user-name">{{ Auth::user()->name }}</span>
                        <span class="user-icon">👤</span>
                    </button>

                    <div id="user-dropdown" class="dropdown">
                        <form id="account-form-button" action="{{ route('account.edit') }}" method="GET">
                            @csrf
                            <button id="accountWindowBtn" type="submit" class="dropdown-item">Paskyra</button>
                        </form>

                        <form id="logout-form" action="{{ route('logout') }}" method="POST">
                            @csrf
                            <button id="logoutBtn" type="submit" class="dropdown-item">Atsijungti</button>
                        </form>
                    </div>

                    <div class="language-selector">
                        <button id="current-language" onclick="toggleLanguageDropdown()">Lt</button>

                        <div id="language-dropdown" class="dropdown">
                            <div id="lang-lt" onclick="setLanguage('lt')">Lietuvių</div>
                            <div id="lang-en" onclick="setLanguage('en')">English</div>
                        </div>
                    </div>
                </div>
            @endauth

            @guest
                <div class="guest-menu">
                    @if (Request::is('map'))
                        <a href="{{ route('login') }}" id="login-guest-link" class="login-link">Prisijungti</a>
                    @endif

                    <div class="language-selector">
                        <button id="current-language" onclick="toggleLanguageDropdown()">Lt</button>

                        <div id="language-dropdown" class="dropdown">
                            <div id="lang-lt" onclick="setLanguage('lt')">Lietuvių</div>
                            <div id="lang-en" onclick="setLanguage('en')">English</div>
                        </div>
                    </div>
                </div>
            @endguest
        </div>
    </div>
</header>
