<?php

namespace Tests\Browser;

use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;

class GoogleMapsReviewLinkTest extends DuskTestCase
{
    use DatabaseMigrations;

    /**
     * TS-22: Nuorodos generavimas į „Google Maps“ vietos komentarų peržiūrai
     */
    public function test_google_maps_review_link_is_displayed_in_infowindow()
    {
        $user = User::factory()->create([
            'email' => 'info@example.com',
            'password' => bcrypt(hash('sha512', 'Password_123')),
        ]);

        $this->browse(function (Browser $browser) use ($user) {
            $browser->visit('/login')
                ->type('#email', $user->email)
                ->type('#password', 'Password_123')
                ->press('#loginButton')
                ->waitForLocation('/map', 10)
                ->type('#start', 'Vilnius')
                ->type('#end', 'Vilnius')
                ->press("button[onclick='calculateRoute()']")
                ->waitFor('#fuel-cost-modal', 5)
                ->press('#cancel-fuel')
                ->type('#radius-input', '200')
                ->press("button[onclick='requestSuggestedPlaces()']")
                ->waitFor('#suggested-places li .left-info-btn', 10)
                ->click('#suggested-places li .left-info-btn')
                ->pause(2000)
                ->script("
                    const link = [...document.querySelectorAll('.gm-style-iw a')].find(a => a.textContent.includes('Google Maps'));
                    if (link) link.scrollIntoView({behavior: 'instant', block: 'center'});
                ");
            $browser->pause(500)
                ->assertSee('Google Maps')
                ->screenshot('GoogleMapsReviewLink');
        });
    }
}
