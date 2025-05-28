<?php

namespace Tests\Browser;

use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;

class TripCostCalculationTest extends DuskTestCase
{
    use DatabaseMigrations;

    /**
     * TS-16: Kelionės kainos skaičiavimas pagal degalų ir vietų kainos duomenis
     */
    public function test_trip_cost_calculates_correctly()
    {
        $user = User::factory()->create([
            'email' => 'kaina@example.com',
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
                ->waitFor('#fuel-input', 5)
                ->waitUntilEnabled('#fuel-input', 5)
                ->type('#fuel-input', '6.5')
                ->radio('fuel-type', 'gasoline')
                ->radio('fuel-input', 'custom')
                ->type('#fuel-price-input', '1.45')
                ->press('#confirm-fuel')
                ->pause(1000)
                ->type('#radius-input', '200')
                ->press("button[onclick='requestSuggestedPlaces()']")
                ->waitFor('#suggested-places', 10)
                ->waitFor('#suggested-places li .add-button', 10)
                ->click('#suggested-places li:nth-child(3) .add-button')
                ->waitFor('#trip-plan-list li[data-place-id]', 10)
                ->click('#trip-plan-list li[data-place-id] .price-button')
                ->waitFor('.price-popup input[type="number"]', 5)
                ->type('.price-popup input[type="number"]', '5')
                ->click('.price-popup button')
                ->pause(500)
                ->assertAttribute('#trip-plan-list li[data-place-id]', 'data-price', '5')
                ->pause(1000)
                ->waitFor('#total-place-cost', 5)
                ->assertSeeIn('#total-place-cost', '€')
                ->screenshot('TripCostCalculated');
        });
    }
}
