<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\User;
use App\Models\Trip;
use App\Models\TripPlace;
use Illuminate\Foundation\Testing\RefreshDatabase;

class TripUpdateTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_update_existing_trip()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $trip = Trip::factory()->create([
            'user_id' => $user->id,
            'title' => 'Originalus pavadinimas',
            'start_address' => 'Kaunas',
            'start_lat' => 54.9,
            'start_lng' => 23.9,
            'end_address' => 'Vilnius',
            'end_lat' => 54.7,
            'end_lng' => 25.3,
            'mode' => 'DRIVING',
        ]);

        TripPlace::create([
            'trip_id' => $trip->id,
            'place_id' => 'place1',
            'name' => 'Senasis muziejus',
            'type' => 'museum',
            'address' => 'Muziejaus g. 1',
            'lat' => 54.6,
            'lng' => 25.2,
        ]);

        $response = $this->putJson("/trips/{$trip->id}", [
            'title' => 'Atnaujintas maršrutas',
            'start_name' => 'Startas',
            'start_address' => 'Panevėžys',
            'start_lat' => 55.7,
            'start_lng' => 24.3,
            'end_name' => 'Pabaiga',
            'end_address' => 'Klaipėda',
            'end_lat' => 55.7,
            'end_lng' => 21.1,
            'mode' => 'WALKING',
            'places' => [
                [
                    'place_id' => 'new_place_id',
                    'name' => 'Naujas parkas',
                    'type' => 'park',
                    'address' => 'Parko g. 10',
                    'lat' => 55.8,
                    'lng' => 24.4,
                    'order' => 1,
                ]
            ]
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('trips', [
            'id' => $trip->id,
            'title' => 'Atnaujintas maršrutas',
            'start_address' => 'Panevėžys',
            'end_address' => 'Klaipėda',
            'mode' => 'WALKING'
        ]);
        $this->assertDatabaseMissing('trip_places', ['name' => 'Senasis muziejus']);
        $this->assertDatabaseHas('trip_places', ['name' => 'Naujas parkas']);
    }
}
