<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GuestTripPlanningTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function guest_cannot_save_trip()
    {
        $tripData = [
            'start_location' => 'Vilnius',
            'end_location' => 'Kaunas',
            'places' => [
                ['name' => 'Muziejus', 'latitude' => 54.7, 'longitude' => 25.3],
            ],
            'distance' => 100,
            'duration' => 90,
        ];
        $response = $this->postJson('/trips', $tripData);
        $response->assertStatus(401);
    }
}
