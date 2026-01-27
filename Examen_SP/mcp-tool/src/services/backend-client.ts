/**
 * HTTP client to communicate with the audit microservice
 */

import axios, { AxiosInstance } from 'axios';
import { Logger } from '../utils/logger';

export class BackendClient {
  private client: AxiosInstance;
  private logger: Logger;

  constructor(private baseURL: string) {
    this.logger = new Logger('BackendClient');

    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.logger.info(`Client configured: ${this.baseURL}`);
  }

  /**
   * GET request
   */
  async get<T = any>(path: string): Promise<T> {
    try {
      this.logger.debug(`GET ${path}`);
      const response = await this.client.get<T>(path);
      return response.data;
    } catch (error) {
      this.logger.error(`Error en GET ${path}:`, error);
      throw error;
    }
  }

  /**
   * POST request
   */
  async post<T = any>(path: string, data: any): Promise<T> {
    try {
      this.logger.debug(`POST ${path}`);
      const response = await this.client.post<T>(path, data);
      return response.data;
    } catch (error) {
      this.logger.error(`Error en POST ${path}:`, error);
      throw error;
    }
  }
}
