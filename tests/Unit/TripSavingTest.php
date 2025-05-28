<?php

namespace Tests\Unit;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TripSavingTest extends TestCase
{
    use RefreshDatabase;
    public function test_authenticated_user_can_save_trip()
    {
        $user = User::factory()->create();
        $this->actingAs($user);
        $response = $this->postJson('/trips', [
            'title' => 'Testinė kelionė',
            'start_name' => 'Startas',
            'start_address' => 'Vilnius, Lietuva',
            'start_lat' => 54.6872,
            'start_lng' => 25.2797,
            'end_name' => 'Pabaiga',
            'end_address' => 'Kaunas, Lietuva',
            'end_lat' => 54.8985,
            'end_lng' => 23.9036,
            'distance' => 100.5,
            'duration' => 90,
            'price_total' => 12.34,
            'mode' => 'DRIVING',
            'fuel_type' => 'gasoline',
            'fuel_price' => 1.6,
            'fuel_consumption' => 6.5,
            'places' => [
                [
                    'place_id' => 'abc123',
                    'name' => 'Lankytina vieta',
                    'type' => 'park',
                    'address' => 'Parko g. 1, Vilnius',
                    'price' => 5.5,
                    'order' => 1,
                    'lat' => 54.69,
                    'lng' => 25.28,
                    'website' => 'https://parkas.lt'
                ]
            ]
        ]);
        $response->assertStatus(200);
        $this->assertDatabaseHas('trips', [
            'user_id' => $user->id,
            'title' => 'Testinė kelionė',
            'start_address' => 'Vilnius, Lietuva',
            'end_address' => 'Kaunas, Lietuva',
        ]);
    }
}
