import { NextRequest, NextResponse } from 'next/server';
import { getCompleteWeatherData } from '@/lib/weather';
import { getLocationAndCrops } from '@/lib/crops';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');

    if (!lat || !lon) {
      return NextResponse.json(
        { error: 'Se requieren parámetros lat y lon' },
        { status: 400 }
      );
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);

    if (isNaN(latitude) || isNaN(longitude)) {
      return NextResponse.json(
        { error: 'Coordenadas inválidas' },
        { status: 400 }
      );
    }

    // Obtener datos del clima y ubicación en paralelo
    const [weatherData, locationData] = await Promise.all([
      getCompleteWeatherData(latitude, longitude),
      getLocationAndCrops(latitude, longitude),
    ]);

    return NextResponse.json({
      weather: weatherData.weather.weather_desc,
      temp: weatherData.weather.temp,
      air_quality: weatherData.weather.air_quality,
      no2: weatherData.weather.no2,
      pm10: weatherData.weather.pm10,
      pm2_5: weatherData.weather.pm2_5,
      co2_prediction: weatherData.weather.co2_prediction,
      location: locationData.location,
      crops: locationData.crops,
      forecast: weatherData.forecast,
      alerts: weatherData.alerts,
    });
  } catch (error) {
    console.error('Error in weather API:', error);
    return NextResponse.json(
      { error: 'Error al obtener datos del clima' },
      { status: 500 }
    );
  }
}
