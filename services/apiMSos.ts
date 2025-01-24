import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';
import client from '@/services/baseUrl'; 

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

  try {
    const response: AxiosResponse<GetLatestDataResponse> = await client.get('/api/sos/show/Iaisjoiwoe8ojdkiaposudcjqwAIo0wj', config); 

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

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