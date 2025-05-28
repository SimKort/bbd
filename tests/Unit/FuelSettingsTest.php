<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\Trip;
use Illuminate\Foundation\Testing\RefreshDatabase;

class FuelSettingsTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_update_fuel_settings()
    {
        $trip = Trip::factory()->create([
            'fuel_consumption' => 5.0,
            'fuel_price' => 1.60,
            'fuel_type' => 'diesel',
        ]);
        $response = $this->post("/trips/{$trip->id}/fuel", [
            'fuel_consumption' => 6.5,
            'fuel_price' => 1.65,
            'fuel_type' => 'gasoline',
        ]);
        $response->assertRedirect();
        $this->assertDatabaseHas('trips', [
            'id' => $trip->id,
            'fuel_consumption' => '6.50',
            'fuel_price' => '1.65',
            'fuel_type' => 'gasoline',
        ]);
    }

    public function test_invalid_fuel_data_is_rejected()
    {
        $trip = Trip::factory()->create();
        $response = $this->from("/trips/{$trip->id}/edit")->post("/trips/{$trip->id}/fuel", [
            'fuel_consumption' => 'abc',
            'fuel_price' => -1,
            'fuel_type' => 'unknown',
        ]);
        $response->assertSessionHasErrors(['fuel_consumption', 'fuel_price', 'fuel_type']);
    }
}
