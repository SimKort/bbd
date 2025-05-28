<?php

namespace Tests\Browser;

    use App\Models\User;
    use Illuminate\Foundation\Testing\DatabaseMigrations;
    use Laravel\Dusk\Browser;
    use Tests\DuskTestCase;

class FuelConsumptionTest extends DuskTestCase
{
    use DatabaseMigrations;

    /**
     * TS-04: Degalų sąnaudų nustatymas planavimo lange
     */
    public function test_user_can_set_fuel_consumption_and_type()
    {
        $user = User::factory()->create([
            'email' => 'fueltest@example.com',
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
                ->waitForText('€', 5, '#total-place-cost')
                ->assertSeeIn('#total-place-cost', '€')
                ->screenshot('FuelCostSet');
        });
    }
}
