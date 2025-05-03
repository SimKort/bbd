<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use App\Http\Controllers\AccountController;
use App\Http\Controllers\MapController;
use App\Http\Controllers\TripController;

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

// Paskyros duomenų keitimui
Route::middleware(['auth'])->group(function () {
    Route::get('/account', [AccountController::class, 'edit'])->name('account.edit');
    Route::post('/account', [AccountController::class, 'update'])->name('account.update');
    Route::delete('/account', [AccountController::class, 'destroy'])->name('account.destroy');
});

// Patikrinti ar naujas vartotojo vardas jau užimtas (išskyrus dabartinį vartotoją)
Route::post('/check-name-edit', function (Request $request) {
    $exists = DB::table('users')
        ->where('name', $request->name)
        ->where('id', '!=', auth()->id())
        ->exists();
    return response()->json(['exists' => $exists]);
})->middleware('auth');

// Patikrinti ar naujas el. paštas jau užimtas (išskyrus dabartinį vartotoją)
Route::post('/check-email-edit', function (Request $request) {
    $exists = DB::table('users')
        ->where('email', $request->email)
        ->where('id', '!=', auth()->id())
        ->exists();
    return response()->json(['exists' => $exists]);
})->middleware('auth');

// Patikrinti ar įvestas esamas slaptažodis yra tinkamas
Route::post('/check-current-password', [AccountController::class, 'checkCurrentPassword']);

// Žemėlapio puslapis
Route::get('/map', [MapController::class, 'showMap'])->name('map');

// Kelionės planų išsaugojimui
Route::post('/trips', [TripController::class, 'store'])->middleware('auth');

// Kelionių planų puslapiui
Route::get('/trips', [TripController::class, 'index'])->middleware('auth')->name('trips.index');

// Kelionių plano puslapiui
Route::get('/trips/{id}', [TripController::class, 'show'])->middleware('auth')->name('trips.show');

// Kelionių plano atidarymui Google Maps
Route::get('/api/trips/{id}', [TripController::class, 'getTripData'])->middleware('auth');

// Kelionių plano pdf parsisiuntimui
Route::get('/trips/{id}/download', [TripController::class, 'downloadPdf'])
    ->middleware('auth')->name('trips.download');
