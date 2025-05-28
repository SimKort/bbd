<?php

namespace Tests\Browser;

use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;

class InfoWindowDisplayTest extends DuskTestCase
{
    use DatabaseMigrations;

    /**
     * TS-21: Informacijos lango atidarymas su nuotraukomis, laiku ir kontaktine informacija
     */
    public function test_info_window_displays_correctly()
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
                ->assertSee('Darbo laikas:')
                ->screenshot('InfoWindowOpen');
        });
    }
}
