import axios, { AxiosResponse, AxiosRequestConfig } from 'axios'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from './apiConfig';
// const BASE_URL = 'http://103.171.85.186';
export interface MachineData {
  id: number;
  host_id: number;
  lat: string;
  lng: string;
  temp: number;
  humidity: number;
  pressure: number;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface GetMachinesResponse {
  status: string;
  data: MachineData[];
}

export const getMachinesData = async (): Promise<GetMachinesResponse> => {
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

    const url = `/api/get/machines/kaoicKJilKDiaqwoMCMwonxqKXoiqwqxigyrtBHG`; 

    const response: AxiosResponse<GetMachinesResponse> = await client.get(url, {
      ...config,
      headers: {
        ...config.headers,
        'Authorization': `Bearer ${token}`, 
      },
    });

    if (!response.data) {
      throw new Error('No data received from the server');
    }

    // Validate response structure
    if (response.data.status !== 'true') {
      throw new Error('Failed to fetch machine data.');
    }

    return response.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const errorMessage = err.response?.data?.message || 'An error occurred while fetching machine data.';
      throw new Error(errorMessage);
    }
    throw new Error('An unexpected error occurred.');
  }
};