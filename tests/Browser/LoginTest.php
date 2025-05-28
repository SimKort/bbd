<?php

namespace Tests\Browser;

use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;

class LoginTest extends DuskTestCase
{
    use DatabaseMigrations;

    /**
     * TS-03: Prisijungimas su teisingu el. paštu ir slaptažodžiu
     */
    public function test_user_can_login_with_correct_credentials()
    {
        $rawPassword = 'Password_123';
        $sha512Password = hash('sha512', $rawPassword);

        $user = User::factory()->create([
            'email' => 'testuser@example.com',
            'password' => bcrypt($sha512Password),
        ]);

        $this->browse(function (Browser $browser) use ($user, $rawPassword) {
            $browser->visit('/login')
                ->type('#email', $user->email)
                ->type('#password', $rawPassword)
                ->press('#loginButton')
                ->waitForLocation('/map', 10)
                ->assertPathIs('/map')
                ->screenshot('LoginSuccess');
        });
    }
}
