<?php

namespace Tests\Feature;

use App\Models\Trip;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ManualPlaceAddTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_add_manual_place_to_trip()
    {
        $user = User::factory()->create();
        $this->actingAs($user);
        $trip = Trip::factory()->create([
            'user_id' => $user->id,
            'start_address' => 'Kaunas',
            'start_lat' => 54.9,
            'start_lng' => 23.9,
            'end_address' => 'Vilnius',
            'end_lat' => 54.7,
            'end_lng' => 25.3,
            'mode' => 'DRIVING',
            'title' => 'Testinė kelionė',
        ]);
        $response = $this->putJson("/trips/{$trip->id}", [
            'title' => 'Testinė kelionė',
            'start_address' => 'Kaunas',
            'start_lat' => 54.9,
            'start_lng' => 23.9,
            'end_address' => 'Vilnius',
            'end_lat' => 54.7,
            'end_lng' => 25.3,
            'mode' => 'DRIVING',
            'places' => [
                [
                    'place_id' => 'manual-entry',
                    'name' => 'Mano rankinė vieta',
                    'type' => 'custom',
                    'address' => 'Gedimino pr. 1, Vilnius',
                    'price' => null,
                    'order' => 1,
                    'lat' => 54.6872,
                    'lng' => 25.2797,
                    'website' => null,
                ]
            ]
        ]);
        $response->assertStatus(200);
        $this->assertDatabaseHas('trip_places', [
            'name' => 'Mano rankinė vieta',
            'address' => 'Gedimino pr. 1, Vilnius',
        ]);
    }
}
