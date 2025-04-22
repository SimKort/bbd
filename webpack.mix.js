const mix = require('laravel-mix');

mix.js('resources/assets/js/app.js', 'public/js')
    .js('resources/assets/js/toolbar_language.js', 'public/js')
    .js('resources/assets/js/map.js', 'public/js')
    .sass('resources/assets/scss/app.scss', 'public/css')
    .sass('resources/assets/scss/toolbar.scss', 'public/css')
    .sass('resources/assets/scss/map.scss', 'public/css')
    .sourceMaps();

mix.copy('resources/assets/images', 'public/images');

if (mix.inProduction()) {
    mix.version();
}
