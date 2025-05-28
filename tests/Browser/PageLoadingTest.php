<?php

namespace Tests\Browser;

use Illuminate\Foundation\Testing\DatabaseMigrations;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;

class PageLoadingTest extends DuskTestCase
{
    /**
     * TS-01: Puslapio užkrovimas
     */
    public function testPageLoading(): void
    {
        $this->browse(function (Browser $browser) {
            $browser->visit('/')
                    ->screenshot('PageLoading')
                    ->assertSee('Kelionių planavimo įrankis');
        });
    }
}
