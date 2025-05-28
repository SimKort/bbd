<?php

namespace Tests\Browser;

use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;

class RouteRenderedOnMapTest extends DuskTestCase
{
    use DatabaseMigrations;

    /**
     * TS-14: Maršruto atvaizdavimas žemėlapyje (linijos, žymekliai)
     */
    public function test_route_is_rendered_on_map_with_markers()
    {
        $user = User::factory()->create([
            'email' => 'marsrutas@example.com',
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
                ->assertPresent('#map canvas')
                ->screenshot('RouteOnMap');
        });
    }
}
