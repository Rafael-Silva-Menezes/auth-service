import {
  RefreshSessionDto,
  RefreshSessionResultDto,
} from '../dtos/refreshSessionDto';
import { IBaseUseCaseProtocol } from './baseUseCaseProtocol';

export interface IRefreshSessionUseCaseProtocol
  extends IBaseUseCaseProtocol<
    RefreshSessionDto,
    Promise<RefreshSessionResultDto>
  > {}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace IRefreshSessionUseCaseProtocol {
  export const TOKEN = 'IRefreshSessionUseCaseProtocol';
}
