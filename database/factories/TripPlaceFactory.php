<?php

namespace Database\Factories;

use App\Models\TripPlace;
use Illuminate\Database\Eloquent\Factories\Factory;

class TripPlaceFactory extends Factory
{
    protected $model = TripPlace::class;
    public function definition()
    {
        return [
            'name' => $this->faker->company,
            'latitude' => $this->faker->latitude(54.5, 55.0),
            'longitude' => $this->faker->longitude(25.0, 25.6),
        ];
    }
}
