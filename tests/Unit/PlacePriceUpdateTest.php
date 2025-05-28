<?php

namespace Tests\Unit;

use App\Models\User;
use App\Models\Trip;
use App\Models\TripPlace;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PlacePriceUpdateTest extends TestCase
{
    use RefreshDatabase;
    public function test_user_can_update_place_price()
    {
        $user = User::factory()->create();
        $this->actingAs($user);
        $trip = Trip::factory()->create(['user_id' => $user->id]);
        $place = TripPlace::create([
            'trip_id' => $trip->id,
            'place_id' => 'abc123',
            'name' => 'Test vieta',
            'address' => 'Adresas 1',
            'lat' => 54.9,
            'lng' => 23.9,
            'price' => null,
            'website' => 'https://example.com'
        ]);
        $response = $this->post("/trip-places/{$place->place_id}/update-website", [
            'website' => 'https://example.com',
            'price' => 12.5
        ]);
        $response->assertStatus(200);
        $this->assertDatabaseHas('trip_places', [
            'place_id' => 'abc123',
            'price' => 12.5
        ]);
    }
}
