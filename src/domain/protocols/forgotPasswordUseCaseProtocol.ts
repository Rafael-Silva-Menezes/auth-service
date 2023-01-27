import {
  ForgotPasswordResultDto,
  UserForgotPasswordDto,
} from '../dtos/forgotPasswordDto';
import { IBaseUseCaseProtocol } from './baseUseCaseProtocol';

export interface IForgotPasswordUseCaseProtocol
  extends IBaseUseCaseProtocol<
    UserForgotPasswordDto,
    Promise<ForgotPasswordResultDto>
  > {}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace IForgotPasswordUseCaseProtocol {
  export const TOKEN = 'IForgotPasswordUseCaseProtocol';
}
