<?php

namespace Tests\Unit;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;

class TripPriceCalculationTest extends TestCase
{
    use RefreshDatabase;
    public function test_trip_total_price_is_calculated_and_displayed()
    {
        $user = User::factory()->create();
        $this->actingAs($user);
        $response = $this->postJson('/trips', [
            'title' => 'Kelionė su kaina',
            'start_name' => 'Startas',
            'start_address' => 'Vilnius',
            'start_lat' => 54.6,
            'start_lng' => 25.2,
            'end_name' => 'Pabaiga',
            'end_address' => 'Kaunas',
            'end_lat' => 54.8,
            'end_lng' => 23.9,
            'distance' => 150,
            'duration' => 120,
            'price_total' => 23.6,
            'mode' => 'DRIVING',
            'fuel_type' => 'gasoline',
            'fuel_price' => 1.6,
            'fuel_consumption' => 6.5,
            'places' => [
                [
                    'place_id' => 'a1',
                    'name' => 'Parkas',
                    'type' => 'park',
                    'address' => 'Parko g.',
                    'price' => 5.0,
                    'order' => 1,
                    'lat' => 54.7,
                    'lng' => 25.3,
                    'website' => null
                ],
                [
                    'place_id' => 'a2',
                    'name' => 'Muziejus',
                    'type' => 'museum',
                    'address' => 'Muziejaus g.',
                    'price' => 3.0,
                    'order' => 2,
                    'lat' => 54.75,
                    'lng' => 25.35,
                    'website' => null
                ]
            ]
        ]);
        $response->assertStatus(200);
        $tripId = $response->json('trip_id');
        $this->assertDatabaseHas('trips', [
            'id' => $tripId,
            'price_total' => 23.6
        ]);
        $page = $this->get("/trips/{$tripId}");
        $page->assertStatus(200);
        $page->assertSeeText('Numatoma kaina: 23.6 €');
    }
}
