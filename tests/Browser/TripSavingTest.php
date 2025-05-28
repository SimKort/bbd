<?php

namespace Tests\Browser;

use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;

class TripSavingTest extends DuskTestCase
{
    use DatabaseMigrations;

    /**
     * TS-11: Prisijungusio naudotojo kelionės išsaugojimas paskyroje
     */
    public function test_user_can_save_trip()
    {
        $user = User::factory()->create([
            'email' => 'saugotikelione@example.com',
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
                ->waitFor('#suggested-places', 20)
                ->click('#suggested-places li .add-button')
                ->waitFor('#trip-plan-list li[data-place-id] .delete-button', 20)
                ->pause(1000)
                ->press('#saveTripPlan')
                ->waitFor('#trip-title-input', 5)
                ->type('#trip-title-input', 'Testinė kelionė')
                ->press('#confirm-trip-title')
                ->waitForLocation('/trips', 10)
                ->assertPathIs('/trips')
                ->screenshot('TripSaved');
        });
    }
}
