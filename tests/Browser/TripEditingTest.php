<?php

namespace Tests\Browser;

use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;

class TripEditingTest extends DuskTestCase
{
    use DatabaseMigrations;

    /**
     * TS-09: Kelionės redagavimas: vietų šalinimas, keitimas ar pridėjimas
     */
    public function test_user_can_edit_trip_by_adding_and_removing_places()
    {
        $user = User::factory()->create([
            'email' => 'redagavimas@example.com',
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
                ->click('#suggested-places li .add-button')
                ->waitFor('#trip-plan-list li[data-place-id] .delete-button', 10)
                ->click('#trip-plan-list li[data-place-id] .delete-button')
                ->press('#confirm-delete')
                ->pause(1000)
                ->assertMissing('#trip-plan-list li[data-place-id]')
                ->screenshot('TripEdited');
        });
    }
}
