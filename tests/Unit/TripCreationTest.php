<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

class TripCreationTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_create_trip_with_start_and_end_points()
    {
        $user = User::factory()->create();
        $this->actingAs($user);
        $response = $this->postJson('/trips', [
            'title' => 'Test Trip',
            'start_name' => 'Start Location',
            'start_address' => 'Kaunas',
            'start_lat' => 54.9,
            'start_lng' => 23.9,
            'end_name' => 'End Location',
            'end_address' => 'Vilnius',
            'end_lat' => 54.7,
            'end_lng' => 25.3,
            'mode' => 'DRIVING',
            'places' => [
                [
                    'place_id' => 'place1',
                    'name' => 'Museum',
                    'type' => 'museum',
                    'address' => 'Museum Street',
                    'price' => 10,
                    'order' => 1,
                    'lat' => 54.6872,
                    'lng' => 25.2797,
                    'website' => 'http://museum.example.com',
                ]
            ]
        ]);
        $response->assertStatus(200);
        $response->assertJson(['success' => true]);
        $this->assertDatabaseHas('trips', ['title' => 'Test Trip']);
        $this->assertDatabaseHas('trip_places', ['name' => 'Museum']);
    }

    public function test_trip_creation_requires_required_fields()
    {
        $user = User::factory()->create();
        $this->actingAs($user);
        $response = $this->postJson('/trips', []);
        $response->assertStatus(422);
        $response->assertJsonValidationErrors([
            'title', 'start_address', 'start_lat', 'start_lng',
            'end_address', 'end_lat', 'end_lng',
            'places', 'mode'
        ]);
    }
}
