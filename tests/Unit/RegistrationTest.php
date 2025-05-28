<?php

namespace Tests\Unit;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_register_with_valid_data()
    {
        $response = $this->post('/register', [
            'name' => 'TestUser',
            'email' => 'test@example.com',
            'password' => '$2y$08$DkE8a2w1HUlIEzOYw7bVe.FewmT9g7Dda9R1s/yDCAYTPq.z6PQie\sdrtyhvcxsrtuijnhytrszxcytrdsdfguikjRDjgGFdDSDTGTFHJKikLHjgghfdgCDX',
            'password_confirmation' => '$2y$08$DkE8a2w1HUlIEzOYw7bVe.FewmT9g7Dda9R1s/yDCAYTPq.z6PQie\sdrtyhvcxsrtuijnhytrszxcytrdsdfguikjRDjgGFdDSDTGTFHJKikLHjgghfdgCDX',
        ]);

        $response->assertRedirect('/map');
        $this->assertDatabaseHas('users', ['email' => 'test@example.com']);
    }

    public function test_user_cannot_register_with_existing_email()
    {
        User::factory()->create(['email' => 'test@example.com']);

        $response = $this->post('/register', [
            'name' => 'TestUser2',
            'email' => 'test@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertSessionHasErrors('email');
    }

    public function test_user_cannot_register_with_invalid_data()
    {
        $response = $this->post('/register', [
            'name' => '',
            'email' => 'invalid-email',
            'password' => 'short',
            'password_confirmation' => 'mismatch',
        ]);

        $response->assertSessionHasErrors(['name', 'email', 'password']);
    }
}
