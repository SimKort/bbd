<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('trips', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->string('start_address');
            $table->string('end_address');
            $table->float('distance')->nullable(); // km
            $table->integer('duration')->nullable(); // minutėmis
            $table->float('price_total')->nullable(); // € ar USD
            $table->string('mode')->default('DRIVING'); // reikšmės: DRIVING arba WALKING
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('trips');
    }
};
