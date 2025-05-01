<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('trips', function (Blueprint $table) {
            $table->string('fuel_type')->nullable(); // pvz.: gasoline, diesel
            $table->decimal('fuel_price', 8, 2)->nullable(); // pvz. 1.59
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::table('trips', function (Blueprint $table) {
            $table->dropColumn(['fuel_type', 'fuel_price']);
        });
    }
};
