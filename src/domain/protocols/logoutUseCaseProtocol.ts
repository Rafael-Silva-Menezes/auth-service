import { LogoutDto, LogoutResultDto } from '../dtos/logoutDto';
import { IBaseUseCaseProtocol } from './baseUseCaseProtocol';

export interface ILogoutUseCaseProtocol
  extends IBaseUseCaseProtocol<LogoutDto, Promise<LogoutResultDto>> {}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ILogoutUseCaseProtocol {
  export const TOKEN = 'ILogoutUseCaseProtocol';
}
