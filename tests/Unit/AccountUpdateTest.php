<?php

namespace Tests\Unit;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AccountUpdateTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_update_name_and_email()
    {
        $user = User::factory()->create();
        $this->actingAs($user);
        $response = $this->post('/account', [
            'name' => 'Naujas Vardas',
            'email' => 'naujas@example.com',
        ]);
        $response->assertRedirect(route('account.edit'));
        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'name' => 'Naujas Vardas',
            'email' => 'naujas@example.com',
        ]);
    }

    public function test_user_can_update_password()
    {
        $user = User::factory()->create();
        $this->actingAs($user);
        $response = $this->post('/account', [
            'name' => $user->name,
            'email' => $user->email,
            'password' => 'Slaptazodis123',
            'password_confirmation' => 'Slaptazodis123',
        ]);
        $response->assertRedirect(route('account.edit'));
        $this->assertTrue(Hash::check('Slaptazodis123', $user->fresh()->password));
    }

    public function test_invalid_data_fails_validation()
    {
        $user = User::factory()->create();
        $this->actingAs($user);
        $response = $this->post('/account', [
            'name' => '',
            'email' => 'neteisingas',
            'password' => 'short',
            'password_confirmation' => 'neatitinka',
        ]);
        $response->assertSessionHasErrors(['name', 'email', 'password']);
    }
}
