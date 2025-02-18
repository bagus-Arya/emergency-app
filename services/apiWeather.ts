import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';

const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

export interface WeatherResponse {
  coord: {
    lon: number;
    lat: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  base: string;
  main: {
    temp: number;
    feels_like: number; 
    temp_min: number;   
    temp_max: number;   
    pressure: number;
    humidity: number;
    sea_level: number;
    grnd_level: number; 
  };
  visibility: number; 
  wind: {
    speed: number;
    deg?: number; 
    gust?: number; 
  };
  clouds: {
    all: number; 
  };
  dt: number; 
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number; 
  id: number; 
  name: string; 
  cod: number; 
}

// Define the function to fetch weather data
export const fetchWeatherData = async (lat: number, lon: number, apiKey: string): Promise<WeatherResponse> => {
  const config: AxiosRequestConfig = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    validateStatus: (status) => true,
  };

  try {
    const response: AxiosResponse<WeatherResponse> = await axios.get(BASE_URL, {
      params: {
        lat,
        lon,
        appid: apiKey,
        units: 'metric',
      },
      ...config,
    });

    if (response.status !== 200) {
      throw new Error(`Error fetching weather data: ${response.statusText}`);
    }

    return response.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const errorMessage = err.response?.data?.message || 'An error occurred while fetching weather data.';
      throw new Error(errorMessage);
    }
    throw new Error('An unexpected error occurred.');
  }
};