import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from './apiConfig';
// const BASE_URL = 'http://103.171.85.186';
export interface User {
  id: number;
  name: string;
  email: string;
  role: string; 
  group_id: number;
  group_name: string; 
}

export interface LoginResponse {
  status: boolean;
  message: string;
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const config: AxiosRequestConfig = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    validateStatus: (status) => true // Accept all status codes
  };
  
  const client = axios.create({
    baseURL: BASE_URL,
  });

  try {
    const response: AxiosResponse<LoginResponse> = await client.post('/api/login', credentials, config);

    if (!response.data.status) {
      throw new Error(response.data.message);
    }

    if (response.data.token) {
      await Promise.all([
        AsyncStorage.setItem('token', response.data.token),
        AsyncStorage.setItem('userData', JSON.stringify(response.data.user))
      ]);
      client.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    }

    return response.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const errorMessage = err.response?.data?.message || 'An error occurred during login.';
      throw new Error(errorMessage);
    }
    throw new Error('An unexpected error occurred.');
  }
};

export const isLoggedIn = async (): Promise<boolean> => {
  try {
    const [token, userData] = await Promise.all([
      AsyncStorage.getItem('token'),
      AsyncStorage.getItem('userData')
    ]);
    return !!(token && userData);
  } catch (error) {
    return false;
  }
};

export const logout = async (): Promise<void> => {
  await Promise.all([
    AsyncStorage.removeItem('token'),
    AsyncStorage.removeItem('userData')
  ]);
  const client = axios.create({
    baseURL: 'http://103.171.85.186'
  });
  delete client.defaults.headers.common['Authorization'];
};