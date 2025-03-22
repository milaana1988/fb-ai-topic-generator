import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

export class APIClient {
  private client: AxiosInstance;

  /**
   * Creates a new instance of the API client.
   *
   * @param {string} baseURL - The base URL of the API.
   * @param {string} [token] - The Bearer token to use for authentication.
   */
  constructor(baseURL: string, token?: string) {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    this.client = axios.create({
      baseURL,
      headers,
    });
  }

  /**
   * Sends a GET request to the given URL.
   *
   * @param {string} url - The URL of the request.
   * @param {AxiosRequestConfig} [config] - The configuration of the request.
   * @returns {Promise<AxiosResponse<T>>} - The response of the request.
   */
  public get<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.client.get<T>(url, config);
  }

  /**
   * Sends a POST request to the given URL with the provided data.
   *
   * @param {string} url - The URL of the request.
   * @param {any} [data] - The data to be sent as the request body.
   * @param {AxiosRequestConfig} [config] - The configuration of the request.
   * @returns {Promise<AxiosResponse<T>>} - The response of the request.
   */

  public post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.client.post<T>(url, data, config);
  }
}
