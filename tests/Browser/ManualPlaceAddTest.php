<?php

namespace Tests\Browser;

use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;

class ManualPlaceAddTest extends DuskTestCase
{
    use DatabaseMigrations;

    /**
     * TS-08: Vietos pridėjimas rankiniu būdu (formoje)
     */
    public function test_user_can_add_custom_place_manually()
    {
        $user = User::factory()->create([
            'email' => 'vietarankiniu@example.com',
            'password' => bcrypt(hash('sha512', 'Password_123')),
        ]);

        $this->browse(function (Browser $browser) use ($user) {
            $browser->visit('/login')
                ->type('#email', $user->email)
                ->type('#password', 'Password_123')
                ->press('#loginButton')
                ->waitForLocation('/map', 10)
                ->waitForLocation('/map', 10)
                ->assertPathIs('/map')
                ->waitFor('#map', 10)
                ->type('#start', 'Vilnius')
                ->type('#end', 'Vilnius')
                ->press("button[onclick='calculateRoute()']")
                ->waitFor('#fuel-cost-modal', 5)
                ->press('#cancel-fuel')
                ->type('#radius-input', '200')
                ->press("button[onclick='requestSuggestedPlaces()']")
                ->waitFor('#suggested-places', 10)
                ->type('#custom-place', 'Europos parkas')
                ->press("button[onclick='addCustomPlace()']")
                ->pause(2000)
                ->assertVisible('#suggested-places')
                ->assertPresent('#suggested-places li')
                ->screenshot('ManualPlaceAddSuccess');
        });
    }
}
