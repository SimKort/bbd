<?php

namespace Tests\Feature;

use App\Models\Trip;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SavedTripsViewTest extends TestCase
{
    use RefreshDatabase;
    public function test_authenticated_user_sees_only_their_saved_trips()
    {
        $userA = User::factory()->create();
        $userB = User::factory()->create();
        Trip::factory()->create([
            'user_id' => $userA->id,
            'title' => 'Kelionė A1',
        ]);
        Trip::factory()->create([
            'user_id' => $userA->id,
            'title' => 'Kelionė A2',
        ]);
        Trip::factory()->create([
            'user_id' => $userB->id,
            'title' => 'Kelionė B1',
        ]);
        $this->actingAs($userA);
        $response = $this->get('/trips');
        $response->assertStatus(200);
        $response->assertSeeText('Kelionė A1');
        $response->assertSeeText('Kelionė A2');
        $response->assertDontSeeText('Kelionė B1');
    }
}
