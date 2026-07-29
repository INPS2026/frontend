import axios from 'axios';
import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import { TokenService } from './token-service';
import { ApiError } from '@/types/api';

export function createBrowserApiClient() {
  const client = axios.create({
    withCredentials: true,
  });

  client.interceptors.request.use((config) => {
    const token = TokenService.getAccessToken();

    if (token) {
      config.headers.set('Authorization', `Bearer ${token}`);
    }

    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    (err: AxiosError<ApiError>) => {
      const message =
        err.response?.data?.message ||
        err.message ||
        'Something went wrong. Try again.';
      return Promise.reject({ ...err, message });
    },
  );

  return client;
}

export async function clientRequest<T>(
  apiClient: AxiosInstance,
  config: AxiosRequestConfig,
): Promise<T> {
  const res: AxiosResponse<T> = await apiClient(config);
  return res.data;
}
