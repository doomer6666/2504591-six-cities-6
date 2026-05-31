import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { toast } from 'react-toastify';

import { Token } from './utils';

const BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL ?? 'http://localhost:4000';
const REQUEST_TIMEOUT = 5000;

type ErrorResponse = {
  error?: string;
  message?: string;
};

export const createAPI = (): AxiosInstance => {
  const api = axios.create({
    baseURL: BACKEND_URL,
    timeout: REQUEST_TIMEOUT,
  });

  api.interceptors.request.use((config: AxiosRequestConfig) => {
    const token = Token.get();

    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    (error: AxiosError<ErrorResponse>) => {
      toast.dismiss();
      const message = error.response
        ? (error.response.data?.error ??
          error.response.data?.message ??
          error.message)
        : error.message;
      toast.warn(message);

      return Promise.reject(error);
    }
  );

  return api;
};
