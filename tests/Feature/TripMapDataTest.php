<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Trip;
use App\Models\TripPlace;
use Illuminate\Foundation\Testing\RefreshDatabase;

class TripMapDataTest extends TestCase
{
    use RefreshDatabase;

    public function test_trip_data_for_map_contains_required_fields()
    {
        $user = User::factory()->create();
        $this->actingAs($user);
        $trip = Trip::factory()->create([
            'user_id' => $user->id,
            'start_address' => 'Kaunas',
            'end_address' => 'Vilnius',
            'start_lat' => 54.9,
            'start_lng' => 23.9,
            'end_lat' => 54.7,
            'end_lng' => 25.3,
            'mode' => 'DRIVING',
        ]);
        TripPlace::create([
            'trip_id' => $trip->id,
            'place_id' => 'abc123',
            'name' => 'Parkas',
            'type' => 'park',
            'address' => 'Parko g.',
            'price' => 0,
            'order' => 1,
            'lat' => 54.8,
            'lng' => 24.5,
        ]);
        $response = $this->get("/map?trip_id={$trip->id}");
        $response->assertStatus(200);
        $response->assertSee('Parkas');
        $response->assertSee('Kaunas');
        $response->assertSee('Vilnius');
    }
}
