<?php

namespace Tests\Browser;

use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;

class SuggestedPlacesTest extends DuskTestCase
{
    use DatabaseMigrations;

    /**
     * TS-07: Automatiniai lankytinų vietų pasiūlymai pakeliui pagal filtrus
     */
    public function test_user_can_get_suggested_places_along_route()
    {
        $user = User::factory()->create([
            'email' => 'vietos@example.com',
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
                ->assertVisible('#suggested-places')
                ->assertPresent('#suggested-places li')
                ->screenshot('SuggestedPlacesSuccess');
        });
    }
}
