<?php

namespace Tests\Browser;

use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;

class PlaceFilterByTypeTest extends DuskTestCase
{
    use DatabaseMigrations;

    /**
     * TS-15: Vietų filtravimas pagal pasirinktą tipą (pvz., muziejai, parkai)
     */
    public function test_suggested_places_are_filtered_by_selected_type()
    {
        $user = User::factory()->create([
            'email' => 'filtravimas@example.com',
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
                ->type('#end', 'Vilnius')
                ->press("button[onclick='calculateRoute()']")
                ->waitFor('#fuel-cost-modal', 5)
                ->press('#cancel-fuel')
                ->type('#radius-input', '200');
            $browser->script("
                        const dropdown = document.getElementById('place-type-dropdown');
                        if (dropdown) {
                            dropdown.style.display = 'block';
                            dropdown.style.visibility = 'visible';
                            dropdown.style.opacity = '1';
                            dropdown.style.zIndex = '1000';
                        }
                    ");
            $browser->pause(500);
            $browser->script("
                        document.querySelectorAll('#place-type-checkboxes input').forEach(cb => cb.checked = false);
                        const park = document.querySelector('#place-type-checkboxes input[value=\"park\"]');
                        if (park) park.checked = true;
                    ");
            $browser->pause(200);
            $browser->press("button[onclick='requestSuggestedPlaces()']")
                ->waitFor('#suggested-places li', 10)
                ->assertPresent('#suggested-places li')
                ->screenshot('FilteredByPark');
        });
    }
}
