<?php

namespace Tests\Browser;

use Laravel\Dusk\Browser;
use Tests\DuskTestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

class RegisterTest extends DuskTestCase
{
    use RefreshDatabase;

    /**
     * TS-02: Registracija su teisingais duomenimis
     */
    public function test_user_can_register_with_valid_data()
    {
        $email = 'newuser' . rand(1000, 9999) . '@example.com';

        $this->browse(function (Browser $browser) use ($email) {
            $browser->visit('/register')
                ->type('#name', 'TestUser')
                ->type('#email', $email)
                ->type('#password', 'Password_123')
                ->type('#password-confirm', 'Password_123')
                ->press('#registerButton')
                ->waitForLocation('/map', 10)
                ->assertPathIs('/map')
                ->screenshot('RegisterSuccess');
        });
    }
}
