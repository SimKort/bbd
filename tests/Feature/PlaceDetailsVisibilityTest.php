<?php

namespace Tests\Feature;

use App\Models\Trip;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PlaceDetailsVisibilityTest extends TestCase
{
    use RefreshDatabase;
    public function test_place_details_are_visible_on_map_page()
    {
        $user = User::factory()->create();
        $this->actingAs($user);
        $trip = Trip::factory()->create(['user_id' => $user->id]);
        $trip->places()->create([
            'place_id' => 'test123',
            'name' => 'Test Museum',
            'type' => 'museum',
            'address' => 'Museum Street 1',
            'price' => 10.00,
            'order' => 1,
            'lat' => 54.68,
            'lng' => 25.28,
            'website' => 'https://example.com',
        ]);
        $response = $this->get('/map?trip_id=' . $trip->id);
        $response->assertStatus(200);
        $response->assertSee('Test Museum');
        $response->assertSee('Museum Street 1');
        $response->assertSeeText('example.com');
    }
}
