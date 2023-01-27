export interface IHttpProvider<R> {
  get<T = any>(
    url: string,
    requestConfig: R,
    requestId?: string,
  ): Promise<IHttpProviderResponseType<T>>;
  post<T = any>(
    url: string,
    requestConfig: R,
    requestId?: string,
  ): Promise<IHttpProviderResponseType<T>>;
  put<T = any>(
    url: string,
    requestConfig: R,
    requestId?: string,
  ): Promise<IHttpProviderResponseType<T>>;
  patch<T = any>(
    url: string,
    requestConfig: R,
    requestId?: string,
  ): Promise<IHttpProviderResponseType<T>>;
  delete<T = any>(
    url: string,
    requestConfig: R,
    requestId?: string,
  ): Promise<IHttpProviderResponseType<T>>;
}

export interface IHttpProviderResponseType<T> {
  headers: any;
  status: any;
  success: boolean;
  data: T;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace IHttpProvider {
  export const TOKEN = 'IHttpProvider';
}
