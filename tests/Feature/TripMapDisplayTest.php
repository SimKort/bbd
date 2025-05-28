<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TripMapDisplayTest extends TestCase
{
    use RefreshDatabase;
    public function test_trip_map_data_is_included_in_trip_page()
    {
        $user = User::factory()->create();
        $this->actingAs($user);
        $response = $this->postJson('/trips', [
            'title' => 'Kelionė su žemėlapiu',
            'start_name' => 'Pradžia',
            'start_address' => 'Vilnius',
            'start_lat' => 54.6,
            'start_lng' => 25.2,
            'end_name' => 'Pabaiga',
            'end_address' => 'Kaunas',
            'end_lat' => 54.8,
            'end_lng' => 23.9,
            'distance' => 120,
            'duration' => 100,
            'price_total' => 19.9,
            'mode' => 'DRIVING',
            'fuel_type' => 'gasoline',
            'fuel_price' => 1.5,
            'fuel_consumption' => 6.0,
            'places' => [
                [
                    'place_id' => 'abc123',
                    'name' => 'Lankytina vieta',
                    'type' => 'park',
                    'address' => 'Parko g. 1',
                    'price' => 0,
                    'order' => 1,
                    'lat' => 54.7,
                    'lng' => 25.3,
                    'website' => null
                ]
            ]
        ]);
        $tripId = $response->json('trip_id');
        $page = $this->get("/trips/{$tripId}");
        $page->assertStatus(200);
        $page->assertSee('window.tripData = {');
        $page->assertSeeText('54.6');
        $page->assertSeeText('23.9');
        $page->assertSee('places');
    }
}
