import { AxiosRequestConfig, AxiosStatic } from 'axios';
import { IHttpProviderResponseType } from '../protocols/httpProvider';
import { Injectable, Inject } from '@nestjs/common';
import { IAxiosHttpProvider } from '../protocols/axiosHttpProvider';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { loggerMeta } from '@/config/loggerMeta';

@Injectable()
export class AxiosHttpProvider implements IAxiosHttpProvider {
  private readonly logMeta = loggerMeta(AxiosHttpProvider.name);

  constructor(
    private readonly httpClient: AxiosStatic,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  private async makeRequest<T>(
    url: string,
    requestConfig: AxiosRequestConfig,
    requestId?: string,
  ): Promise<IHttpProviderResponseType<T>> {
    try {
      const result = await this.httpClient.request({
        url,
        ...requestConfig,
        validateStatus: (status: number) => status < 500,
      });

      const success = this.isRequestSuccess(result.status);

      if (!success) {
        this.logNoSuccess(url, result.status, requestId);
      }

      return {
        headers: result.headers,
        status: result.status,
        data: result.data,
        success,
      };
    } catch (error) {
      this.logger.error(error.message, this.logMeta(requestId, error));
      throw error;
    }
  }

  private isRequestSuccess(status: number): boolean {
    return `${status}`[0] === '2' ? true : false;
  }

  private logNoSuccess(url: string, status: number, requestId?: string) {
    this.logger.warn(
      `Request to ${url} resulted on ${status}`,
      this.logMeta(requestId),
    );
  }

  async get<T>(
    url: string,
    requestConfig: AxiosRequestConfig,
  ): Promise<IHttpProviderResponseType<T>> {
    return this.makeRequest(url, { ...requestConfig, method: 'get' });
  }

  async post<T>(
    url: string,
    requestConfig: AxiosRequestConfig,
    requestId?: string,
  ): Promise<IHttpProviderResponseType<T>> {
    return this.makeRequest(
      url,
      { ...requestConfig, method: 'post' },
      requestId,
    );
  }

  async delete<T>(
    url: string,
    requestConfig: AxiosRequestConfig,
    requestId?: string,
  ): Promise<IHttpProviderResponseType<T>> {
    return this.makeRequest(
      url,
      { ...requestConfig, method: 'delete' },
      requestId,
    );
  }

  async put<T>(
    url: string,
    requestConfig: AxiosRequestConfig,
    requestId?: string,
  ): Promise<IHttpProviderResponseType<T>> {
    return this.makeRequest(
      url,
      { ...requestConfig, method: 'put' },
      requestId,
    );
  }

  async patch<T>(
    url: string,
    requestConfig: AxiosRequestConfig,
    requestId?: string,
  ): Promise<IHttpProviderResponseType<T>> {
    return this.makeRequest(
      url,
      { ...requestConfig, method: 'patch' },
      requestId,
    );
  }
}
