<?php

namespace Tests\Feature;

use App\Models\Trip;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TripPdfDownloadTest extends TestCase
{
    use RefreshDatabase;
    public function test_guest_cannot_download_trip_pdf()
    {
        $trip = Trip::factory()->create();
        $response = $this->get("/trips/{$trip->id}/download");
        $response->assertRedirect('/login');
    }
}
