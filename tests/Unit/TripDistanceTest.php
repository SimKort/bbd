<?php

namespace Tests\Unit;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TripDistanceTest extends TestCase
{
    use RefreshDatabase;

    public function test_trip_distance_is_saved_and_displayed()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $response = $this->postJson('/trips', [
            'title' => 'Kelionė su atstumu',
            'start_name' => 'Startas',
            'start_address' => 'Vilnius',
            'start_lat' => 54.6,
            'start_lng' => 25.2,
            'end_name' => 'Pabaiga',
            'end_address' => 'Kaunas',
            'end_lat' => 54.8,
            'end_lng' => 23.9,
            'distance' => 123.4,
            'duration' => 90,
            'price_total' => 20.0,
            'mode' => 'DRIVING',
            'fuel_type' => 'gasoline',
            'fuel_price' => 1.5,
            'fuel_consumption' => 6.5,
            'places' => [
                [
                    'place_id' => 'xyz789',
                    'name' => 'Muziejus',
                    'type' => 'museum',
                    'address' => 'Muziejaus g.',
                    'price' => 10.0,
                    'order' => 1,
                    'lat' => 54.7,
                    'lng' => 25.3,
                    'website' => null
                ]
            ]
        ]);

        $response->assertStatus(200);
        $tripId = $response->json('trip_id');

        // DB įrašas egzistuoja
        $this->assertDatabaseHas('trips', [
            'id' => $tripId,
            'distance' => 123.4
        ]);

        // Atstumas rodomas puslapyje
        $page = $this->get("/trips/{$tripId}");
        $page->assertStatus(200);
        $page->assertSeeText('Atstumas: 123.4 km');
    }
}
