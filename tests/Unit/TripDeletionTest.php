<?php

namespace Tests\Unit;

use App\Models\User;
use App\Models\Trip;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TripDeletionTest extends TestCase
{
    use RefreshDatabase;
    public function test_user_can_delete_their_own_trip()
    {
        $user = User::factory()->create();
        $this->actingAs($user);
        $trip = Trip::factory()->create([
            'user_id' => $user->id,
            'title' => 'Turiu ištrinti'
        ]);
        $response = $this->delete("/trips/{$trip->id}");
        $response->assertRedirect(route('trips.index'));
        $this->assertDatabaseMissing('trips', [
            'id' => $trip->id,
        ]);
    }

    public function test_user_cannot_delete_others_trip()
    {
        $userA = User::factory()->create();
        $userB = User::factory()->create();
        $trip = Trip::factory()->create([
            'user_id' => $userB->id,
        ]);
        $this->actingAs($userA);
        $response = $this->delete("/trips/{$trip->id}");
        $response->assertStatus(404);
        $this->assertDatabaseHas('trips', [
            'id' => $trip->id,
        ]);
    }
}
