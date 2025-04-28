<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;
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

// Patikrinti ar el. paštas egzistuoja
Route::post('/check-login', function (Illuminate\Http\Request $request) {
    $user = User::where('email', $request->email)->first();
    if (!$user) { return response()->json(['exists' => false]); }
    if (!Hash::check($request->password, $user->password)) { return response()->json(['exists' => true, 'passwordCorrect' => false]); }
    return response()->json(['exists' => true, 'passwordCorrect' => true]);
});

// Žemėlapio puslapis
Route::get('/map', [MapController::class, 'showMap'])->name('map');
