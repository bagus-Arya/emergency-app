import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from './apiConfig';
// const BASE_URL = 'http://103.171.85.186';
export interface MachineData {
  lat: string; 
  lng: string; 
  host_id: number;
  machine_name: number; 
}

export interface GetLatestDataResponse {
  success: boolean;
  message: string;
  data: MachineData[];
}

export const getLatestData = async (): Promise<MachineData[]> => {
  const config: AxiosRequestConfig = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    validateStatus: (status) => true, 
  };
  const client = axios.create({
    baseURL: BASE_URL,
  });
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      throw new Error('User  is not authenticated');
    }
    
    const url = `/api/sos/show/Iaisjoiwoe8ojdkiaposudcjqwAIo0wj`;

    const response: AxiosResponse<GetLatestDataResponse> = await client.get(url, {
        ...config,
        headers: {
        ...config.headers,
        'Authorization': `Bearer ${token}`, 
        },
    });

    return response.data.data.slice(0, 5);
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const errorMessage = err.response?.data?.message || 'An error occurred while fetching data.';
      console.error('API Error:', errorMessage);
      throw new Error(errorMessage);
    }
    console.error('Unexpected Error:', err);
    throw new Error('An unexpected error occurred.');
  }
};