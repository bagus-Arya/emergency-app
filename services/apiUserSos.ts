import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserSosRequest {
  lat: number;
  lng: number;
  group_staff_fishermans_id: number;
}

export interface UserSosResponse {
  message: string; 
}

export const postUserSosData = async (data: UserSosRequest, userId: string): Promise<UserSosResponse> => {
  const config: AxiosRequestConfig = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    validateStatus: (status) => true, 
  };
  
  const client = axios.create({
    baseURL: 'http://103.171.85.186'
  });

  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      throw new Error('User  is not authenticated');
    }

    const url = `/api/sos/store/Naksjcoiqwekllsdjpkjuepclaol/${userId}`;

    const response: AxiosResponse<UserSosResponse> = await client.post(url, data, {
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
      const errorMessage = err.response?.data?.message || 'An error occurred while posting SOS data.';
      throw new Error(errorMessage);
    }
    throw new Error('An unexpected error occurred.');
  }
};