<?php

namespace Tests\Browser;

use App\Models\User;
use App\Models\Trip;
use App\Models\TripPlace;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;

class TripDeleteTest extends DuskTestCase
{
    use DatabaseMigrations;

    /**
     * TS-18: Išsaugotų maršrutų sąrašo peržiūra prisijungusiam naudotojui
     */
    public function test_user_can_view_saved_trips_list()
    {
        $user = User::factory()->create([
            'email' => 'perziura@example.com',
            'password' => bcrypt(hash('sha512', 'Password_123')),
        ]);

        $tripTitle = 'Testinė kelionė';

        $trip = Trip::create([
            'user_id' => $user->id,
            'title' => $tripTitle,
            'start_name' => 'Kaunas',
            'start_address' => 'Kaunas, Lietuva',
            'start_lat' => 54.9,
            'start_lng' => 23.9,
            'end_name' => 'Vilnius',
            'end_address' => 'Vilnius, Lietuva',
            'end_lat' => 54.7,
            'end_lng' => 25.3,
            'distance' => 100,
            'duration' => 100,
            'price_total' => 15.5,
            'mode' => 'DRIVING',
            'fuel_type' => 'gasoline',
            'fuel_price' => 1.60,
            'fuel_consumption' => 6.50
        ]);

        TripPlace::create([
            'trip_id' => $trip->id,
            'place_id' => 'abc123',
            'name' => 'Vilniaus katedra',
            'address' => 'Katedros aikštė, Vilnius',
            'price' => 5,
            'type' => 'church',
            'lat' => 54.6872,
            'lng' => 25.2797,
            'order' => 1,
        ]);

        $this->browse(function (Browser $browser) use ($trip, $user, $tripTitle) {
            $browser->visit('/login')
                ->type('#email', $user->email)
                ->type('#password', 'Password_123')
                ->press('#loginButton')
                ->waitForLocation('/map', 10)
                ->visit('/trips')
                ->waitForText($tripTitle, 5)
                ->assertSee($tripTitle);
                $browser->script("openDeleteModal({$trip->id});");
                $browser->waitFor('#delete-modal', 5);
                $browser->press('#confirm-trip-title');
                $browser->pause(1000);
                $browser->assertDontSee($trip->title);
                $browser->screenshot('TripDeleted');
        });
    }
}
