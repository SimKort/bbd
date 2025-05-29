<?php

namespace Tests\Unit;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\Trip;
use App\Models\TripPlace;

class FilterTest extends TestCase
{
    use RefreshDatabase;
    public function test_suggested_places_can_be_filtered_by_type()
    {
        $user = User::factory()->create();
        $this->actingAs($user);
        $trip = Trip::factory()->create(['user_id' => $user->id]);
        TripPlace::create([
            'trip_id' => $trip->id,
            'place_id' => 'p1',
            'name' => 'Miesto parkas',
            'type' => 'park',
            'address' => 'Parko g. 1',
            'lat' => 54.6,
            'lng' => 25.3,
        ]);
        TripPlace::create([
            'trip_id' => $trip->id,
            'place_id' => 'p2',
            'name' => 'Lietuvos muziejus',
            'type' => 'museum',
            'address' => 'Muziejaus g. 2',
            'lat' => 54.7,
            'lng' => 25.2,
        ]);
        $response = $this->getJson("/api/trips/{$trip->id}/places?types[]=park");
        $response->assertStatus(200);
        $response->assertJsonCount(1);
        $response->assertJsonFragment(['type' => 'park']);
        $response->assertJsonMissing(['type' => 'museum']);
    }
}
