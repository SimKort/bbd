const mix = require('laravel-mix');

mix.js('resources/assets/js/app.js', 'public/js')
    .js('resources/assets/js/toolbar_language_welcome.js', 'public/js')
    .js('resources/assets/js/toolbar_language_register.js', 'public/js')
    .js('resources/assets/js/toolbar_language_login.js', 'public/js')
    .js('resources/assets/js/toolbar_language_map.js', 'public/js')
    .js('resources/assets/js/welcome.js', 'public/js')
    .js('resources/assets/js/register.js', 'public/js')
    .js('resources/assets/js/login.js', 'public/js')
    .js('resources/assets/js/map.js', 'public/js')
    .sass('resources/assets/scss/app.scss', 'public/css')
    .sass('resources/assets/scss/toolbar.scss', 'public/css')
    .sass('resources/assets/scss/welcome.scss', 'public/css')
    .sass('resources/assets/scss/register.scss', 'public/css')
    .sass('resources/assets/scss/login.scss', 'public/css')
    .sass('resources/assets/scss/map.scss', 'public/css')
.sourceMaps();

mix.copy('resources/assets/images', 'public/images');
mix.copy('resources/assets/data', 'public/data');

if (mix.inProduction()) {
    mix.version();
}
