import {
  SignUpUseCaseInput,
  SignUpUseCaseOutput,
} from '../dtos/signUpUseCaseDto';
import { IBaseUseCaseProtocol } from '../protocols/baseUseCaseProtocol';

export interface ISignUpUseCaseProtocol
  extends IBaseUseCaseProtocol<
    SignUpUseCaseInput,
    Promise<SignUpUseCaseOutput>
  > {}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ISignUpUseCaseProtocol {
  export const TOKEN = 'ISignUpUseCaseProtocol';
}
