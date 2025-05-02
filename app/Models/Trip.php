<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Trip extends Model
{
    protected $fillable = [
        'user_id',
        'title',
        'start_name',
        'start_address',
        'start_lat', 'start_lng',
        'end_name',
        'end_address',
        'end_lat', 'end_lng',
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
