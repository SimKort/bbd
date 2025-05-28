<?php

namespace Database\Factories;

use App\Models\Trip;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class TripFactory extends Factory
{
    protected $model = Trip::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'title' => $this->faker->sentence(3),
            'start_name' => 'Kaunas',
            'start_address' => 'Kaunas, Lietuva',
            'start_lat' => 54.9,
            'start_lng' => 23.9,
            'end_name' => 'Vilnius',
            'end_address' => 'Vilnius, Lietuva',
            'end_lat' => 54.7,
            'end_lng' => 25.3,
            'distance' => 100000,
            'duration' => 5400,
            'price_total' => 15.5,
            'mode' => 'DRIVING',
            'fuel_type' => 'gasoline',
            'fuel_price' => 1.60,
            'fuel_consumption' => 6.50,
        ];
    }
}
