import axios from 'axios';
import { WeatherData, DailyForecast } from '../types';

/**
 * Open-Meteo Free Public Weather API
 * Endpoint: https://api.open-meteo.com/v1/forecast
 * Documentation: https://open-meteo.com/en/docs
 * Features: 100% free, no API key required, provides real-time & 7-day garden forecast.
 */

const WMO_CODE_MAP: Record<number, { label: string; icon: string }> = {
  0: { label: 'Clear Sky', icon: '☀️' },
  1: { label: 'Mainly Clear', icon: '🌤️' },
  2: { label: 'Partly Cloudy', icon: '⛅' },
  3: { label: 'Overcast', icon: '☁️' },
  45: { label: 'Foggy', icon: '🌫️' },
  48: { label: 'Depositing Rime Fog', icon: '🌫️' },
  51: { label: 'Light Drizzle', icon: '🌦️' },
  53: { label: 'Moderate Drizzle', icon: '🌦️' },
  55: { label: 'Dense Drizzle', icon: '🌧️' },
  61: { label: 'Slight Rain', icon: '🌦️' },
  63: { label: 'Moderate Rain', icon: '🌧️' },
  65: { label: 'Heavy Rain', icon: '🌧️' },
  71: { label: 'Slight Snow Fall', icon: '🌨️' },
  73: { label: 'Moderate Snow Fall', icon: '🌨️' },
  75: { label: 'Heavy Snow Fall', icon: '❄️' },
  80: { label: 'Slight Rain Showers', icon: '🌦️' },
  81: { label: 'Moderate Rain Showers', icon: '🌧️' },
  82: { label: 'Violent Rain Showers', icon: '⛈️' },
  95: { label: 'Thunderstorm', icon: '⛈️' },
};

export const getWeatherDescription = (code: number) => {
  return WMO_CODE_MAP[code] || { label: 'Partly Cloudy', icon: '⛅' };
};

export async function fetchGardenWeather(
  cityName: string,
  country: string,
  lat: number,
  lon: number
): Promise<WeatherData> {
  // Using Axios GET request as explicitly required by Assignment Task 2
  const url = 'https://api.open-meteo.com/v1/forecast';

  const response = await axios.get(url, {
    params: {
      latitude: lat,
      longitude: lon,
      current: 'temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m',
      daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max',
      timezone: 'auto',
    },
    timeout: 10000,
  });

  const data = response.data;
  const current = data.current;
  const daily = data.daily;

  // Process 7-day daily forecast
  const dailyForecasts: DailyForecast[] = (daily.time as string[]).map((dateStr, index) => {
    const minTemp = daily.temperature_2m_min[index];
    const maxTemp = daily.temperature_2m_max[index];
    const precipSum = daily.precipitation_sum[index] || 0;
    const precipProb = daily.precipitation_probability_max[index] || 0;
    const code = daily.weather_code[index];
    // Frost alert if minimum temperature dips to 2°C or lower
    const frostRisk = minTemp <= 2.0;

    return {
      date: dateStr,
      minTemp: Math.round(minTemp * 10) / 10,
      maxTemp: Math.round(maxTemp * 10) / 10,
      precipitationSum: Math.round(precipSum * 10) / 10,
      precipitationProbability: precipProb,
      weatherCode: code,
      frostRisk,
    };
  });

  // Calculate intelligent gardening watering and frost alert
  const upcomingRain = dailyForecasts.slice(0, 3).reduce((sum, d) => sum + d.precipitationSum, 0);
  const upcomingFrost = dailyForecasts.some((d) => d.frostRisk);

  let wateringAdvice = 'Normal watering schedule recommended. Soil moisture should be checked daily.';
  if (upcomingRain > 12) {
    wateringAdvice = `Heavy rain forecast (${upcomingRain.toFixed(1)}mm next 3 days). Hold back manual watering; let rainfall water your garden beds!`;
  } else if (upcomingRain > 4) {
    wateringAdvice = `Moderate showers expected (${upcomingRain.toFixed(1)}mm). Light watering only around sheltered or container plants.`;
  } else if (current.temperature > 28) {
    wateringAdvice = 'High temperature alert. Water deeply at sunrise or sunset to prevent root dehydration.';
  }

  return {
    city: cityName,
    country,
    latitude: lat,
    longitude: lon,
    elevation: data.elevation || 0,
    current: {
      temperature: Math.round(current.temperature_2m * 10) / 10,
      humidity: current.relative_humidity_2m,
      precipitation: current.precipitation,
      windSpeed: current.wind_speed_10m,
      weatherCode: current.weather_code,
      time: current.time,
    },
    daily: dailyForecasts,
    wateringAdvice,
    frostAlert: upcomingFrost,
    fetchedAt: new Date().toLocaleTimeString(),
  };
}
