import axios, { AxiosResponse, AxiosRequestConfig } from 'axios'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from './apiConfig';
// const BASE_URL = 'http://103.171.85.186';
export interface SosData {
  lat: string; 
  lng: string;
  group_staff_fishermans_id: number;
  staff_nm: string;
}

export interface GetSosResponse {
  success: boolean;
  message: string;
  data: SosData[];
}

export const getSosData = async (sosId: string): Promise<GetSosResponse> => {
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

    const url = `/api/sos/show/UI8iqknk28HJsdplkmaj2xcIfsjasi`;

    const response: AxiosResponse<GetSosResponse> = await client.get(url, {
      ...config,
      headers: {
        ...config.headers,
        'Authorization': `Bearer ${token}`, 
      },
    });

    if (!response.data) {
      throw new Error('No data received from the server');
    }

    return response.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const errorMessage = err.response?.data?.message || 'An error occurred while fetching SOS data.';
      throw new Error(errorMessage);
    }
    throw new Error('An unexpected error occurred.');
  }
};