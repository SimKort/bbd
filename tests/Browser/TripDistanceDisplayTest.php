<?php

namespace Tests\Browser;

use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;

class TripDistanceDisplayTest extends DuskTestCase
{
    use DatabaseMigrations;

    /**
     * TS-13: Atstumo kilometrais rodymas plane ir žemėlapyje
     */
    public function test_trip_distance_is_displayed_correctly()
    {
        $user = User::factory()->create([
            'email' => 'atstumas@example.com',
            'password' => bcrypt(hash('sha512', 'Password_123')),
        ]);

        $this->browse(function (Browser $browser) use ($user) {
            $browser->visit('/login')
                ->type('#email', $user->email)
                ->type('#password', 'Password_123')
                ->press('#loginButton')
                ->waitForLocation('/map', 10)
                ->assertPathIs('/map')
                ->waitFor('#map', 10)
                ->type('#start', 'Vilnius')
                ->type('#end', 'Kaunas')
                ->press("button[onclick='calculateRoute()']")
                ->waitFor('#fuel-cost-modal', 5)
                ->press('#cancel-fuel')
                ->waitFor('#distance', 10)
                ->assertSeeIn('#distance', 'km')
                ->screenshot('TripDistanceVisible');
        });
    }
}
