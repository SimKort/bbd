<header class="toolbar">
    <div class="toolbar-content">
        <a href="/" id="toolbar-title" class="logo">🌍 Kelionių planavimo įrankis</a>
        <div class="toolbar-actions">
            @auth
                <div class="user-menu">
                    <button class="user-button" onclick="toggleUserDropdown()">
                        <span class="user-name">{{ Auth::user()->name }}</span>
                        <span class="user-icon">👤</span>
                    </button>

                    <div id="user-dropdown" class="dropdown">
                        <form id="logout-form" action="{{ route('logout') }}" method="POST">
                            @csrf
                            <button type="submit" class="dropdown-item">Atsijungti</button>
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
                        <a href="{{ route('login') }}" class="login-link">Prisijungti</a>
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
