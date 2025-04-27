<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Foundation\Auth\RegistersUsers;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class RegisterController extends Controller
{
    use RegistersUsers;

    /**
     * Where to redirect users after registration.
     *
     * @var string
     */
    protected $redirectTo = '/map';

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest');
    }

    /**
     * Get a validator for an incoming registration request.
     *
     * @param  array  $data
     * @return \Illuminate\Contracts\Validation\Validator
     */
    protected function validator(array $data)
    {
        $validator = Validator::make($data, [
            'name' => ['required', 'string', 'max:15', 'unique:users,name'],
            'email' => ['required', 'string', 'email', 'max:50', 'unique:users'],
            'password' => ['required', 'string', 'min:128', 'confirmed'],
        ], [
            'name.required' => 'Naudotojo vardas yra privalomas.',
            'name.unique' => 'Toks naudotojo vardas jau egzistuoja.',
            'email.required' => 'El. paštas yra privalomas.',
            'email.email' => 'Neteisingas el. pašto formatas.',
            'email.unique' => 'Toks el. paštas jau naudojamas.',
            'email.max' => 'El. paštas negali būti ilgesnis nei 50 simbolių.',
            'password.required' => 'Slaptažodis yra privalomas.',
            'password.confirmed' => 'Slaptažodžiai nesutampa.',
        ]);
        return $validator;
    }

    /**
     * Create a new user instance after a valid registration.
     *
     * @param  array  $data
     * @return \App\Models\User
     */
    protected function create(array $data)
    {
        return User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);
    }
}
