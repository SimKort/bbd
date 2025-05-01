<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Trip extends Model
{
    protected $fillable = [
        'user_id',
        'title',
        'start_address',
        'end_address',
        'distance',
        'duration',
        'price_total',
        'mode',
        'fuel_type',
        'fuel_price',
        'fuel_consumption',
    ];

    public function places()
    {
        return $this->hasMany(TripPlace::class);
    }
}
