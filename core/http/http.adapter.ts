import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { API_URL } from '../mocks/handlers/constants';

export interface HttpAdapter {
  get<T>(url: string, config?: unknown): Promise<T>;
  post<T>(url: string, data?: unknown, config?: unknown): Promise<T>;
  put<T>(url: string, data?: unknown, config?: unknown): Promise<T>;
  delete<T>(url: string, config?: unknown): Promise<T>;
}

export class AxiosHttpAdapter implements HttpAdapter {
  private api: AxiosInstance;

  constructor(baseURL: string = API_URL) {
    this.api = axios.create({
      baseURL,
      adapter: 'fetch',
    });
  }

  async get<T>(url: string, config?: unknown): Promise<T> {
    const response = await this.api.get<T>(url, config as AxiosRequestConfig);
    return response.data;
  }

  async post<T>(url: string, data?: unknown, config?: unknown): Promise<T> {
    const response = await this.api.post<T>(
      url,
      data,
      config as AxiosRequestConfig,
    );
    return response.data;
  }

  async put<T>(url: string, data?: unknown, config?: unknown): Promise<T> {
    const response = await this.api.put<T>(
      url,
      data,
      config as AxiosRequestConfig,
    );
    return response.data;
  }

  async delete<T>(url: string, config?: unknown): Promise<T> {
    const response = await this.api.delete<T>(
      url,
      config as AxiosRequestConfig,
    );
    return response.data;
  }
}

export const http = new AxiosHttpAdapter();
