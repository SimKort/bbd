<?php

namespace Tests\Browser;

use Illuminate\Foundation\Testing\DatabaseMigrations;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;

class GuestTripTemporaryTest extends DuskTestCase
{
    use DatabaseMigrations;

    /**
     * TS-17: Laikino plano kūrimas neprisijungus ir paskyros siūlymas išsaugant
     */
    public function test_guest_creates_temporary_plan_and_is_prompted_to_register()
    {
        $this->browse(function (Browser $browser) {
            $email = 'naujokas' . rand(1000, 9999) . '@test.lt';

            $browser->visit('/map')
                ->waitFor('#map', 10)
                ->type('#start', 'Vilnius')
                ->type('#end', 'Vilnius')
                ->press("button[onclick='calculateRoute()']")
                ->waitFor('#fuel-cost-modal', 5)
                ->press('#cancel-fuel')
                ->type('#radius-input', '200')
                ->press("button[onclick='requestSuggestedPlaces()']")
                ->waitFor('#suggested-places li .add-button', 10)
                ->click('#suggested-places li .add-button')
                ->waitFor('#trip-plan-list li[data-place-id]', 10)
                ->press('#saveTripPlan')
                ->pause(1000)
                ->press('#guest-restriction-modal-register')
                ->waitForLocation('/register', 5)
                ->type('#name', 'Test Vartotojas')
                ->type('#email', $email)
                ->type('#password', 'Password_123')
                ->type('#password-confirm', 'Password_123')
                ->press('#registerButton')
                ->waitForLocation('/trips', 20)
                ->assertPathIs('/trips')
                ->assertSee('Mano kelionė')
                ->screenshot('GuestRegisteredAndTripSaved');
        });
    }
}
