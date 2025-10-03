export interface WeatherData {
  temp: number;
  weather_desc: string;
  air_quality: number;
  no2: number;
  pm10: number;
  pm2_5: number;
  co2_prediction: string;
}

export interface ForecastData {
  list: Array<{
    dt_txt: string;
    main: {
      temp: number;
    };
    weather: Array<{
      main: string;
      description: string;
    }>;
  }>;
}

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

// Función para predecir niveles de CO2 basado en AQI
export function predictCO2(aqi: number): string {
  if (aqi === 1) return "Bajos niveles de CO2 (350-400 ppm)";
  if (aqi === 2) return "Moderados niveles de CO2 (400-450 ppm)";
  if (aqi === 3) return "Altos niveles de CO2 (450-500 ppm)";
  if (aqi === 4) return "Muy altos niveles de CO2 (500-600 ppm)";
  return "Peligrosos niveles de CO2 (>600 ppm)";
}

// Obtener datos del clima actual
export async function getCurrentWeather(lat: number, lon: number) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Error fetching weather data');
  return response.json();
}

// Obtener calidad del aire
export async function getAirQuality(lat: number, lon: number) {
  const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Error fetching air quality data');
  return response.json();
}

// Obtener pronóstico del clima
export async function getWeatherForecast(lat: number, lon: number, days: number = 8) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&cnt=${days * 8}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Error fetching forecast data');
  return response.json();
}

// Detectar cambios significativos en el pronóstico
export function detectSignificantChanges(forecastData: ForecastData): string[] {
  const significantEvents: string[] = [];

  for (const day of forecastData.list) {
    const weatherMain = day.weather[0]?.main;
    if (['Rain', 'Snow', 'Extreme'].includes(weatherMain)) {
      significantEvents.push(
        `${day.weather[0].description} el ${day.dt_txt}`
      );
    }
  }

  return significantEvents;
}

// Obtener datos completos del clima
export async function getCompleteWeatherData(lat: number, lon: number): Promise<{
  weather: WeatherData;
  forecast: ForecastData;
  alerts: string[];
}> {
  const [weatherResponse, airQualityResponse, forecastResponse] = await Promise.all([
    getCurrentWeather(lat, lon),
    getAirQuality(lat, lon),
    getWeatherForecast(lat, lon, 8),
  ]);

  const temp = weatherResponse.main.temp;
  const weather_desc = weatherResponse.weather[0].description;
  const aqi = airQualityResponse.list[0].main.aqi;
  const components = airQualityResponse.list[0].components;

  const weatherData: WeatherData = {
    temp,
    weather_desc,
    air_quality: aqi,
    no2: components.no2,
    pm10: components.pm10,
    pm2_5: components.pm2_5,
    co2_prediction: predictCO2(aqi),
  };

  const alerts = detectSignificantChanges(forecastResponse);

  return {
    weather: weatherData,
    forecast: forecastResponse,
    alerts,
  };
}
