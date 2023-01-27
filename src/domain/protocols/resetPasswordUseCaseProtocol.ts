import { IBaseUseCaseProtocol } from '@/domain/protocols/baseUseCaseProtocol';
import {
  ResetPasswordUseCaseInput,
  ResetPasswordUseCaseOutput,
} from '../dtos/resetPasswordDto';

export interface IResetPasswordUseCaseProtocol
  extends IBaseUseCaseProtocol<
    ResetPasswordUseCaseInput,
    Promise<ResetPasswordUseCaseOutput>
  > {}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace IResetPasswordUseCaseProtocol {
  export const TOKEN = 'IResetPasswordUseCaseProtocol';
}
