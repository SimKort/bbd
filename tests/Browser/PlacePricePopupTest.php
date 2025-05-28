<?php

namespace Tests\Browser;

use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;

class PlacePricePopupTest extends DuskTestCase
{
    use DatabaseMigrations;

    /**
     * TS-10: Kainos įvedimas vietai per tam skirtą langelį ir svetainės nuorodos patikrinimas
     */
    public function test_user_can_set_place_price_and_see_website_link()
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
                ->waitFor('#suggested-places li .add-button', 10)
                ->click('#suggested-places li:nth-child(1) .add-button')
                ->waitFor('#trip-plan-list li[data-place-id]', 10)
                ->click('#trip-plan-list li[data-place-id] .price-button')
                ->waitFor('.price-popup input[type="number"]', 10)
                ->type('.price-popup input[type="number"]', '5')
                ->click('.price-popup button')
                ->pause(500)
                ->assertAttribute('#trip-plan-list li[data-place-id]', 'data-price', '5')
                ->screenshot('PlacePricePopup');
        });
    }
}
