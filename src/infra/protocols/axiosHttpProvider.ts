import { IHttpProvider } from './httpProvider';
import { AxiosRequestConfig } from 'axios';

export interface IAxiosHttpProvider extends IHttpProvider<AxiosRequestConfig> { }
