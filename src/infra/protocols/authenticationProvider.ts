import {
  AccountAuthenticationInputDto,
  ResetUserPasswordInputDto,
  CreateUserInputDto,
} from '../dtos/authenticationProviderDto';
import { authenticationProviderHttpResponse } from '../dtos/authenticationProviderHttpResponse';

export interface IAuthenticationProvider {
  createUser(
    createParams: CreateUserInputDto,
    requestId?: string,
  ): Promise<IAuthenticationProvider.createUserOutput>;
  authenticate(
    authParams: AccountAuthenticationInputDto,
    requestId?: string,
  ): Promise<IAuthenticationProvider.authenticateOutput>;
  userInfo(
    accessToken: string,
    requestId?: string,
  ): Promise<IAuthenticationProvider.userInfoOutput>;
  resetPassword(
    userParams: ResetUserPasswordInputDto,
    requestId?: string,
  ): Promise<IAuthenticationProvider.resetPasswordOutput>;
  logOut(
    userId: string,
    requestId?: string,
  ): Promise<IAuthenticationProvider.logOutOutput>;
  refreshSession(
    refreshToken: string,
    requestId?: string,
  ): Promise<IAuthenticationProvider.refreshSessionOutput>;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace IAuthenticationProvider {
  export const TOKEN = 'IAuthenticationProvider';

  export type createUserOutput = {
    success: boolean;
  };

  export type userInfoOutput = {
    success: boolean;
    userInfo: unknown;
  };

  export type resetPasswordOutput = {
    success: boolean;
  };

  export type logOutOutput = {
    success: boolean;
    error?: string;
  };

  export type authenticateOutput = authenticationProviderHttpResponse;

  export type refreshSessionOutput =
    | refreshSessionSuccess
    | refreshSessionError;

  type refreshSessionSuccess = {
    success: true;
    accessToken: string;
    expiresInAccessToken: number;
    refreshToken: string;
    expiresInRefreshToken: number;
  };

  type refreshSessionError = {
    success: false;
    error: string;
  };
}
