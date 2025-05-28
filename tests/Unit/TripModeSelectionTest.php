<?php

namespace Tests\Unit;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;

class TripModeSelectionTest extends TestCase
{
    use RefreshDatabase;
    public function test_trip_with_driving_mode_is_saved()
    {
        $user = User::factory()->create();
        $this->actingAs($user);
        $response = $this->postJson('/trips', [
            'title' => 'Automobiliu kelionė',
            'start_name' => 'Startas',
            'start_address' => 'Vilnius',
            'start_lat' => 54.6,
            'start_lng' => 25.2,
            'end_name' => 'Pabaiga',
            'end_address' => 'Kaunas',
            'end_lat' => 54.8,
            'end_lng' => 23.9,
            'distance' => 100,
            'duration' => 90,
            'price_total' => 15.0,
            'mode' => 'DRIVING',
            'fuel_type' => 'gasoline',
            'fuel_price' => 1.6,
            'fuel_consumption' => 6.0,
            'places' => [
                [
                    'place_id' => 'xyz123',
                    'name' => 'Testo vieta',
                    'type' => 'park',
                    'address' => 'Gatvė 1',
                    'price' => 0,
                    'order' => 1,
                    'lat' => 54.7,
                    'lng' => 25.3,
                    'website' => null
                ]
            ]
        ]);
        $response->assertStatus(200);
        $this->assertDatabaseHas('trips', [
            'title' => 'Automobiliu kelionė',
            'mode' => 'DRIVING'
        ]);
    }

    public function test_trip_with_selected_travel_mode_is_saved()
    {
        $user = User::factory()->create();
        $this->actingAs($user);
        $payload = [
            'title' => 'Pėsčiomis kelionė',
            'start_name' => 'Startas',
            'start_address' => 'Vilnius',
            'start_lat' => 54.6,
            'start_lng' => 25.2,
            'end_name' => 'Pabaiga',
            'end_address' => 'Kaunas',
            'end_lat' => 54.8,
            'end_lng' => 23.9,
            'distance' => 123,
            'duration' => 90,
            'price_total' => 0,
            'mode' => 'WALKING',
            'fuel_type' => null,
            'fuel_price' => null,
            'fuel_consumption' => null,
            'places' => [
                [
                    'place_id' => 'abc123',
                    'name' => 'Parkas',
                    'type' => 'park',
                    'address' => 'Parko g. 1',
                    'price' => 0,
                    'order' => 1,
                    'lat' => 54.7,
                    'lng' => 25.3,
                    'website' => null
                ]
            ]
        ];
        $response = $this->postJson('/trips', $payload);
        $response->assertStatus(200);
        $response->assertJson(['success' => true]);
        $this->assertDatabaseHas('trips', [
            'user_id' => $user->id,
            'title' => 'Pėsčiomis kelionė',
            'mode' => 'WALKING',
        ]);
    }
}
