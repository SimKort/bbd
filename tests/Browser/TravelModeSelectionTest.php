<?php

namespace Tests\Browser;

use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;

class TravelModeSelectionTest extends DuskTestCase
{
    use DatabaseMigrations;

    /**
     * TS-06: Kelionės pradžios ir tikslo taškų įvedimas ir maršruto generavimas
     */
    public function test_user_can_generate_route_between_two_points()
    {
        $user = User::factory()->create([
            'email' => 'marshrutai@example.com',
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
                ->waitFor('#mode', 5)
                ->select('#mode', 'WALKING')
                ->press("button[onclick='calculateRoute()']")
                ->waitFor('#distance', 10)
                ->waitFor('#duration', 10)
                ->assertSeeIn('#distance', 'km')
                ->assertSeeIn('#duration', 'min')
                ->screenshot('TravelModeWalkingRoute');
        });
    }
}
