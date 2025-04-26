<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Auth::routes();

Route::get('/map', [App\Http\Controllers\MapController::class, 'showMap'])->name('map');
