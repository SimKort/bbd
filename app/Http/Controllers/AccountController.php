<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AccountController extends Controller
{
    /**
     * Rodyti paskyros redagavimo puslapį.
     */
    public function edit()
    {
        $user = Auth::user();
        return view('account', compact('user'));
    }

    /**
     * Atnaujinti paskyros informaciją.
     */
    public function update(Request $request)
    {
        $user = Auth::user();
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:8|confirmed',
        ]);
        if ($validator->fails()) { return redirect()->back()->withErrors($validator)->withInput(); }
        $user->name = $request->input('name');
        $user->email = $request->input('email');
        if ($request->filled('password')) { $user->password = Hash::make($request->input('password')); }
        $user->save();
        return redirect()->route('account.edit')->with('success', true);
    }

    /**
     * Ištrinti paskyrą.
     */
    public function destroy(Request $request)
    {
        $user = $request->user();
        Auth::logout();
        $user->delete();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect('/')->with('success', true);
    }

    /**
     * Įvesto slaptažodžio patikrinimui.
     */
    public function checkCurrentPassword(Request $request)
    {
        $correct = Hash::check($request->password, Auth::user()->password);
        return response()->json(['correct' => $correct]);
    }
}
