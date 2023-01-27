import {
  SignInUseCaseInput,
  SignInUseCaseOutput,
} from '../dtos/signInUseCaseDto';
import { IBaseUseCaseProtocol } from './baseUseCaseProtocol';

export interface ISignInUseCaseProtocol
  extends IBaseUseCaseProtocol<
    SignInUseCaseInput,
    Promise<SignInUseCaseOutput>
  > {}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ISignInUseCaseProtocol {
  export const TOKEN = 'ISignInUseCaseProtocol';
}
