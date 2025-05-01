<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TripPlace extends Model
{
    protected $fillable = [
        'place_id',
        'name',
        'address',
        'price',
        'order',
        'lat',
        'lng',
    ];

    public function trip()
    {
        return $this->belongsTo(Trip::class);
    }
}
