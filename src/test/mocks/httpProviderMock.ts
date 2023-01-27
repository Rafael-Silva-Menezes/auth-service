import { IHttpProvider } from '@/infra/protocols/httpProvider';
import { AxiosRequestConfig } from 'axios';

export class HttpProviderMock implements IHttpProvider<any> {
  callOrder: string[] = [];

  get<T>(url: string, requestConfig: any): Promise<T> {
    this.callOrder.push('get');
    const httpRequestReturn: T = null;
    return Promise.resolve(httpRequestReturn);
  }
  post<T>(url: string, requestConfig: any): Promise<T> {
    this.callOrder.push('post');
    const httpRequestReturn: T = null;
    return Promise.resolve(httpRequestReturn);
  }

  patch<T>(url: string, requestConfig: any): Promise<T> {
    this.callOrder.push('patch');
    const httpRequestReturn: T = null;
    return Promise.resolve(httpRequestReturn);
  }
  put<T>(url: string, requestConfig: any): Promise<T> {
    this.callOrder.push('put');
    const httpRequestReturn: T = null;
    return Promise.resolve(httpRequestReturn);
  }
  delete<T>(url: string, requestConfig: any): Promise<T> {
    this.callOrder.push('delete');
    const httpRequestReturn: T = null;
    return Promise.resolve(httpRequestReturn);
  }
}
