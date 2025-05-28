<?php

namespace Tests\Unit;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TripDurationTest extends TestCase
{
    use RefreshDatabase;
    public function test_trip_duration_is_saved_and_displayed()
    {
        $user = User::factory()->create();
        $this->actingAs($user);
        $response = $this->postJson('/trips', [
            'title' => 'Kelionė su trukme',
            'start_name' => 'Startas',
            'start_address' => 'Vilnius',
            'start_lat' => 54.6,
            'start_lng' => 25.2,
            'end_name' => 'Pabaiga',
            'end_address' => 'Kaunas',
            'end_lat' => 54.8,
            'end_lng' => 23.9,
            'distance' => 100,
            'duration' => 95,
            'price_total' => 20.0,
            'mode' => 'DRIVING',
            'fuel_type' => 'gasoline',
            'fuel_price' => 1.5,
            'fuel_consumption' => 6.5,
            'places' => [
                [
                    'place_id' => 'abc123',
                    'name' => 'Parkas',
                    'type' => 'park',
                    'address' => 'Parko g.',
                    'price' => 0,
                    'order' => 1,
                    'lat' => 54.7,
                    'lng' => 25.3,
                    'website' => null
                ]
            ]
        ]);
        $response->assertStatus(200);
        $tripId = $response->json('trip_id');
        $this->assertDatabaseHas('trips', [
            'id' => $tripId,
            'duration' => 95
        ]);
        $pageResponse = $this->get("/trips/{$tripId}");
        $pageResponse->assertStatus(200);
    }
}
