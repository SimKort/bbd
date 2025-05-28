<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GuestCanRegisterAndKeepTripTest extends TestCase
{
    use RefreshDatabase;
    public function test_temporary_trip_payload_can_be_saved_after_login()
    {
        $user = User::factory()->create();
        $this->actingAs($user);
        $payload = [
            'title' => 'Testinė kelionė iš localStorage',
            'start_name' => 'Start',
            'start_address' => 'Vilnius',
            'start_lat' => 54.6,
            'start_lng' => 25.2,
            'end_name' => 'End',
            'end_address' => 'Kaunas',
            'end_lat' => 54.8,
            'end_lng' => 23.9,
            'distance' => 123.4,
            'duration' => 90,
            'price_total' => 25.0,
            'mode' => 'DRIVING',
            'fuel_type' => 'gasoline',
            'fuel_price' => 1.6,
            'fuel_consumption' => 6.5,
            'places' => [
                [
                    'place_id' => 'abc123',
                    'name' => 'Parkas',
                    'type' => 'park',
                    'address' => 'Parko g. 1',
                    'price' => 5.0,
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
            'title' => 'Testinė kelionė iš localStorage'
        ]);
    }
}
