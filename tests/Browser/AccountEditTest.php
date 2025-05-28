<?php

namespace Tests\Browser;

use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;

class AccountEditTest extends DuskTestCase
{
    use DatabaseMigrations;

    /**
     * TS-05: Vartotojo vardo ir el. pašto redagavimas paskyros nustatymuose
     */
    public function test_user_can_edit_name_and_email()
    {
        $user = User::factory()->create([
            'name' => 'Test User',
            'email' => 'user@example.com',
            'password' => bcrypt(hash('sha512', 'Password_123')),
        ]);

        $this->browse(function (Browser $browser) use ($user) {
            $newName = 'Editted User';
            $newEmail = 'new@example.com';
            $browser->visit('/login')
                ->type('#email', $user->email)
                ->type('#password', 'Password_123')
                ->press('#loginButton')
                ->waitForLocation('/map', 10)
                ->assertPathIs('/map')
                ->visit('/account')
                ->waitFor('#account-form', 5)
                ->clear('#name')->type('#name', $newName)
                ->clear('#email')->type('#email', $newEmail)
                ->press('#updateAccountBtn')
                ->waitFor('#name', 5)
                ->assertInputValue('#name', $newName)
                ->assertInputValue('#email', $newEmail)
                ->screenshot('AccountEditDone');
        });
    }
}
