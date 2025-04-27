<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use App\Http\Controllers\MapController;

// Pradinis puslapis (welcome)
Route::get('/', function () {
    return view('welcome');
})->name('welcome');

// Laravel auth (prisijungimas, registracija, slaptažodžio atstatymas ir t.t.)
Auth::routes();

// Žemėlapio puslapis
Route::get('/map', [MapController::class, 'showMap'])->name('map');

// Patikrinti ar vardas užimtas
Route::post('/check-username', function (Request $request) {
    $exists = DB::table('users')->where('name', $request->name)->exists();
    return response()->json(['exists' => $exists]);
});

// Patikrinti ar el. paštas užimtas
Route::post('/check-email', function (Request $request) {
    $exists = DB::table('users')->where('email', $request->email)->exists();
    return response()->json(['exists' => $exists]);
});
