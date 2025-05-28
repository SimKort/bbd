<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Trip;
use App\Models\TripPlace;
use Illuminate\Support\Facades\Auth;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\File;

class TripController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'start_name' => 'nullable|string|max:255',
            'start_address' => 'required|string',
            'start_lat' => 'required|numeric',
            'start_lng' => 'required|numeric',
            'end_name' => 'nullable|string|max:255',
            'end_address' => 'required|string',
            'end_lat' => 'required|numeric',
            'end_lng' => 'required|numeric',
            'distance' => 'nullable|numeric',
            'duration' => 'nullable|integer',
            'price_total' => 'nullable|numeric',
            'places' => 'required|array',
            'places.*.place_id' => 'required|string',
            'places.*.name' => 'required|string',
            'places.*.type' => 'nullable|string|max:50',
            'places.*.address' => 'required|string',
            'places.*.price' => 'nullable|numeric',
            'places.*.order' => 'nullable|integer',
            'places.*.lat' => 'required|numeric',
            'places.*.lng' => 'required|numeric',
            'places.*.website' => 'nullable|string',
            'mode' => 'required|in:DRIVING,WALKING',
            'fuel_type' => 'nullable|string|in:gasoline,diesel,electric',
            'fuel_price' => 'nullable|numeric',
            'fuel_consumption' => 'nullable|numeric',
        ]);
        $trip = Trip::create([
            'user_id' => Auth::id(),
            'title' => $validated['title'],
            'start_name' => $validated['start_name'],
            'start_address' => $validated['start_address'],
            'start_lat' => $validated['start_lat'],
            'start_lng' => $validated['start_lng'],
            'end_name' => $validated['end_name'],
            'end_address' => $validated['end_address'],
            'end_lat' => $validated['end_lat'],
            'end_lng' => $validated['end_lng'],
            'distance' => $validated['distance'] ?? null,
            'duration' => $validated['duration'] ?? null,
            'price_total' => $validated['price_total'] ?? null,
            'mode' => $validated['mode'],
            'fuel_type' => $validated['fuel_type'] ?? null,
            'fuel_price' => $validated['fuel_price'] ?? null,
            'fuel_consumption' => $validated['fuel_consumption'] ?? null,
        ]);
        foreach ($validated['places'] as $place) {
            $trip->places()->create($place);
        }
        return response()->json(['success' => true, 'trip_id' => $trip->id]);
    }

    public function index()
    {
        $trips = Trip::where('user_id', auth()->id())->withCount('places')->latest()->get();
        return view('trips.index', compact('trips'));
    }

    public function show($id)
    {
        $trip = Trip::with('places')->where('user_id', auth()->id())->findOrFail($id);
        return view('trips.show', compact('trip'));
    }

    public function getTripData($id)
    {
        $trip = Trip::with('places')->where('user_id', auth()->id())->findOrFail($id);
        return response()->json($trip);
    }

    public function downloadPdf($id, Request $request)
    {
        $trip = Trip::with('places')->where('user_id', auth()->id())->findOrFail($id);
        $lang = $request->query('lang', 'lt');
        $mapUrl = $trip->getEncodedStaticMapUrl();
        if (!$mapUrl) { abort(500, 'Nepavyko sugeneruoti maršruto žemėlapio.'); }
        $filename = 'map_' . $trip->id . '.png';
        $mapPath = public_path('maps/' . $filename);
        if (!File::exists(public_path('maps'))) { File::makeDirectory(public_path('maps'), 0755, true); }
        $imageData = file_get_contents($mapUrl);
        file_put_contents($mapPath, $imageData);
        $pdf = PDF::loadView('trips.pdf', [
            'trip' => $trip,
            'mapImagePath' => $mapPath,
            'lang' => $lang,
        ]);
        return $pdf->download('trip_' . Str::slug($trip->title) . '.pdf');
    }

    public function destroy($id)
    {
        $trip = Trip::where('user_id', auth()->id())->findOrFail($id);
        $trip->delete();
        return redirect()->route('trips.index')->with('success', true);
    }

    public function showMap(Request $request)
    {
        $trip = null;
        if ($request->has('trip_id')) {
            $tripModel = Trip::with('places')->find($request->input('trip_id'));
            if ($tripModel) {
                $trip = [
                    'id' => $tripModel->id,
                    'title' => $tripModel->title,
                    'start_address' => $tripModel->start_address,
                    'end_address' => $tripModel->end_address,
                    'mode' => $tripModel->mode,
                    'fuel_type' => $tripModel->fuel_type,
                    'fuel_price' => $tripModel->fuel_price,
                    'fuel_consumption' => $tripModel->fuel_consumption,
                    'country_code' => $tripModel->country_code,
                    'places' => $tripModel->places->map(function ($place) {
                        return [
                            'place_id' => $place->place_id,
                            'name' => $place->name,
                            'lat' => $place->lat,
                            'lng' => $place->lng,
                            'address' => $place->address,
                            'type' => $place->type,
                            'price' => $place->price,
                            'website' => $place->website,
                        ];
                    })->values()->all()
                ];
            }
        }
        return view('map', [
            'trip' => $trip,
        ]);
    }

    public function updatePlaceWebsite(Request $request, $place_id)
    {
        $request->validate([
            'website' => 'nullable|string|max:255',
            'price' => 'nullable|numeric|min:0',
        ]);
        $place = TripPlace::where('place_id', $place_id)->first();
        if (!$place) { return response()->json(['error' => 'Place not found'], 404); }
        $place->website = $request->input('website');
        $place->price = $request->input('price');
        $place->save();
        return response()->json(['success' => true]);
    }

    public function update(Request $request, $id)
    {
        $trip = Trip::with('places')->where('user_id', auth()->id())->findOrFail($id);
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'start_name' => 'nullable|string|max:255',
            'start_address' => 'required|string',
            'start_lat' => 'required|numeric',
            'start_lng' => 'required|numeric',
            'end_name' => 'nullable|string|max:255',
            'end_address' => 'required|string',
            'end_lat' => 'required|numeric',
            'end_lng' => 'required|numeric',
            'distance' => 'nullable|numeric',
            'duration' => 'nullable|integer',
            'price_total' => 'nullable|numeric',
            'places' => 'required|array',
            'places.*.place_id' => 'required|string',
            'places.*.name' => 'required|string',
            'places.*.type' => 'nullable|string|max:50',
            'places.*.address' => 'required|string',
            'places.*.price' => 'nullable|numeric',
            'places.*.order' => 'nullable|integer',
            'places.*.lat' => 'required|numeric',
            'places.*.lng' => 'required|numeric',
            'places.*.website' => 'nullable|string',
            'mode' => 'required|in:DRIVING,WALKING',
            'fuel_type' => 'nullable|string|in:gasoline,diesel',
            'fuel_price' => 'nullable|numeric',
            'fuel_consumption' => 'nullable|numeric',
        ]);
        $trip->update($validated);
        $trip->places()->delete();
        foreach ($validated['places'] as $place) {
            $trip->places()->create($place);
        }
        return response()->json(['success' => true]);
    }

    public function updateFuel(Request $request, Trip $trip)
    {
        $validated = $request->validate([
            'fuel_consumption' => 'required|numeric|min:0.1|max:50',
            'fuel_price' => 'required|numeric|min:0.1|max:10',
            'fuel_type' => 'required|in:gasoline,diesel',
        ]);
        $trip->update($validated);
        return redirect()->back();
    }

    public function getFilteredPlaces(Request $request, Trip $trip)
    {
        $types = $request->input('types', []);
        $places = $trip->places()
            ->when(!empty($types), fn($q) => $q->whereIn('type', $types))
            ->get();
        return response()->json($places);
    }
}
