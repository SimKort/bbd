<?php

namespace Tests\Browser;

use Illuminate\Foundation\Testing\DatabaseMigrations;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;

class GuestTripPlanningTest extends DuskTestCase
{
    use DatabaseMigrations;

    /**
     * TS-25: Kelionės plano sudarymas neprisijungusiam naudotojui
     */
    public function test_guest_creates_temporary_plan_and_is_prompted_to_register()
    {
        $this->browse(function (Browser $browser) {
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
                ->assertPresent('#trip-plan-list li[data-place-id]')
                ->assertSeeIn('#distance', 'km')
                ->assertSeeIn('#duration', 'min')
                ->screenshot('GuestTripPlan');
        });
    }
}
