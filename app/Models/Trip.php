<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Http;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Trip extends Model
{
    /** @use HasFactory<\Database\Factories\TripFactory> */
    use HasFactory;

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

    public function getGoogleMapsLink(): string
    {
        $origin = urlencode($this->start_address);
        $destination = urlencode($this->end_address);
        $waypointsArray = $this->places
            ->sortBy('order')
            ->pluck('address')
            ->map(fn($address) => urlencode($address));
        $waypoints = implode('|', $waypointsArray->all());
        return "https://www.google.com/maps/dir/?api=1"
            . "&origin={$origin}"
            . "&destination={$destination}"
            . ($waypoints ? "&waypoints={$waypoints}" : "")
            . "&travelmode=" . strtolower($this->mode);
    }

    public function getEncodedStaticMapUrl()
    {
        $apiKey = config('services.google_maps.key');
        $origin = "{$this->start_lat},{$this->start_lng}";
        $destination = "{$this->end_lat},{$this->end_lng}";
        $waypoints = $this->places->sortBy('order')->map(function ($place) {
            return "{$place->lat},{$place->lng}";
        })->implode('|');

        $response = Http::get('https://maps.googleapis.com/maps/api/directions/json', [
            'origin' => $origin,
            'destination' => $destination,
            'waypoints' => $waypoints,
            'mode' => strtolower($this->mode),
            'key' => $apiKey,
        ]);

        if ($response->successful() && isset($response['routes'][0]['overview_polyline']['points'])) {
            $encoded = $response['routes'][0]['overview_polyline']['points'];
            $pathColor = $this->mode === 'WALKING' ? '0x000000' : 'blue';
            $placeMarkers = '';
            $label = 'A';
            foreach ($this->places->sortBy('order') as $place) {
                $marker = "color:yellow|label:$label|{$place->lat},{$place->lng}";
                $placeMarkers .= '&markers=' . urlencode($marker);
                $label++;
            }
            $url = "https://maps.googleapis.com/maps/api/staticmap?scale=2&size=800x400"
                . "&path=color:$pathColor|weight:4|enc:" . urlencode($encoded)
                . "&markers=color:green|label:S|$origin"
                . "&markers=color:red|label:E|$destination"
                . $placeMarkers
                . "&key=$apiKey";
            return $url;
        }
        return null;
    }
}
