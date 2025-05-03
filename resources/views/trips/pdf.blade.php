<!DOCTYPE html>
<html lang="lt">

<head>
    <meta charset="UTF-8">
    <title>{{ $trip->title }}</title>
    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            color: #333;
            padding: 30px;
        }
        h1 {
            font-size: 24px;
            text-align: center;
            margin-bottom: 10px;
        }
        .info > div {
            flex: 1;
            min-width: 120px;
        }
        .plan-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        .item-row {
            display: flex;
            align-items: center;
        }
        .checkbox {
            border: 1px solid #000;
            width: 14px;
            height: 14px;
            display: inline-block;
            margin-right: 10px;
        }
        .place-main {
            border: 1px solid #333333;
            border-radius: 8px;
            margin-bottom: 12px;
            padding: 10px 15px;
            background: #f9f9f9;
            align-items: center;
        }
        .address {
            font-size: 12px;
            color: #555;
        }
        .price {
            font-size: 13px;
            color: #222;
            white-space: nowrap;
        }
    </style>
</head>

<body>
@php
    use Carbon\CarbonInterval;
    $lang = $lang ?? 'lt';
    $labels = [
    'lt' => [
        'mode' => 'Kelionės būdas',
        'distance' => 'Atstumas',
        'duration' => 'Trukmė',
        'price_total' => 'Bendra kaina',
        'start' => 'Pradžios taškas',
        'end' => 'Pabaigos taškas',
        'walking' => 'Pėščiomis',
        'driving' => 'Automobiliu',
    ],
    'en' => [
        'mode' => 'Traveling way',
        'distance' => 'Distance',
        'duration' => 'Duration',
        'price_total' => 'Total price',
        'start' => 'Start point',
        'end' => 'End point',
        'walking' => 'By foot',
        'driving' => 'By car',
    ],
];
$durationFormatted = $trip->duration >= 60
        ? CarbonInterval::minutes($trip->duration)->cascade()->forHumans(['short' => true, 'parts' => 2])
        : $trip->duration . ' min';
@endphp

<h1>{{ $trip->title }}</h1>

<div class="map">
    <img src="{{ public_path('maps/' . basename($mapImagePath)) }}" width="640">
</div>

<table style="font-size: 12px; margin: 0 0 10px 0;">
    <tr>
        <td style="padding-right: 20px;">
            <strong>{{ $labels[$lang]['mode'] }}:</strong>
            {{ $labels[$lang][strtolower($trip->mode)] }}
        </td>
        <td style="padding-right: 20px;"><strong>{{ $labels[$lang]['distance'] }}:</strong> {{ $trip->distance }} km</td>
        <td style="padding-right: 20px;"><strong>{{ $labels[$lang]['duration'] }}:</strong> {{ $durationFormatted }} </td>
        <td><strong>{{ $labels[$lang]['price_total'] }}:</strong> {{ number_format($trip->price_total, 2) }} €</td>
    </tr>
</table>

<ul class="plan-list">
    <li style="margin-bottom: 12px; padding: 10px 15px; background: #f9f9f9; border: 1px solid #333; border-radius: 8px;">
        <table>
            <tr>
                <td style="width: 20px; vertical-align: middle;">
                    <div style="border: 1px solid #000; width: 14px; height: 14px;"></div>
                </td>

                <td style="padding-left: 10px;">
                    <strong style="font-size: 13px;">
                        <span style="color: #a44200;">{{ $labels[$lang]['start'] }}:</span> {{ $trip->start_name }}
                    </strong><br>

                    <span style="font-size: 12px; color: #555;">{{ $trip->start_address }}</span>
                </td>
            </tr>
        </table>
    </li>

    @foreach ($trip->places->sortBy('order') as $i => $place)
        <li style="margin-bottom: 12px; padding: 10px 15px; background: #f9f9f9; border: 1px solid #333; border-radius: 8px;">
            <table style="width: 100%;">
                <tr>
                    <td style="width: 20px; vertical-align: middle;">
                        <div style="border: 1px solid #000; width: 14px; height: 14px;"></div>
                    </td>

                    <td style="padding-left: 10px;">
                        <strong style="font-size: 13px;">
                            <span style="color: #a44200;">{{ $i + 1 }}.</span> {{ $place->name }}
                        </strong><br>

                        <table style="width: 100%;">
                            <tr>
                                <td style="font-size: 12px; color: #555;">{{ $place->address }}</td>
                                @if ($place->price)
                                    <td style="text-align: right; font-size: 12px; white-space: nowrap;">
                                        <span style="color: #4caf50;">💶</span>
                                        <span style="color: #000;">{{ number_format($place->price, 2) }} €</span>
                                    </td>
                                @endif
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </li>
    @endforeach

    <li style="margin-bottom: 12px; padding: 10px 15px; background: #f9f9f9; border: 1px solid #333; border-radius: 8px;">
        <table>
            <tr>
                <td style="width: 20px; vertical-align: middle;">
                    <div style="border: 1px solid #000; width: 14px; height: 14px;"></div>
                </td>

                <td style="padding-left: 10px;">
                    <strong style="font-size: 13px;">
                        <span style="color: #a44200;">{{ $labels[$lang]['end'] }}:</span> {{ $trip->end_name }}
                    </strong><br>
                    <span style="font-size: 12px; color: #555;">{{ $trip->end_address }}</span>
                </td>
            </tr>
        </table>
    </li>
</ul>

</body>
</html>
