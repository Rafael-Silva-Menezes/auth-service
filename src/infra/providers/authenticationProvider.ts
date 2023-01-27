import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  AccountAuthenticationInputDto,
  CreateUserInputDto,
  ResetUserPasswordInputDto,
  ServerAuthenticationParamsInputDto,
} from '../dtos/authenticationProviderDto';
import { IAuthenticationProvider } from '../protocols/authenticationProvider';
import { IAxiosHttpProvider } from '../protocols/axiosHttpProvider';
import { IHttpProvider } from '../protocols/httpProvider';
import { authenticationProviderHttpResponse } from '../dtos/authenticationProviderHttpResponse';
import * as qs from 'qs';
import { IEnvProvider } from '../protocols/envProvider';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { loggerMeta } from '@/config/loggerMeta';

@Injectable()
export class AuthenticationProvider implements IAuthenticationProvider {
  private readonly KEYCLOAK_BASE_URL: string;
  private readonly KEYCLOAK_CLIENT_ID: string;
  private readonly KEYCLOAK_CLIENT_SECRET: string;
  private readonly KEYCLOAK_REALM: string;
  private readonly logMeta = loggerMeta(AuthenticationProvider.name);

  constructor(
    @Inject(IEnvProvider.TOKEN) private readonly envProvider: IEnvProvider,
    @Inject(IHttpProvider.TOKEN)
    private readonly httpProvider: IAxiosHttpProvider,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {
    [
      this.KEYCLOAK_BASE_URL,
      this.KEYCLOAK_CLIENT_SECRET,
      this.KEYCLOAK_CLIENT_ID,
      this.KEYCLOAK_REALM,
    ] = [
      this.envProvider.get('KEYCLOAK_BASE_URL'),
      this.envProvider.get('KEYCLOAK_CLIENT_SECRET'),
      this.envProvider.get('KEYCLOAK_CLIENT_ID'),
      this.envProvider.get('KEYCLOAK_REALM'),
    ];
  }

  private async serverAuthenticate(
    grantType: string,
    params: ServerAuthenticationParamsInputDto,
    requestId: string,
  ): Promise<authenticationProviderHttpResponse> {
    const BodyRequest = {
      client_id: this.KEYCLOAK_CLIENT_ID,
      client_secret: this.KEYCLOAK_CLIENT_SECRET,
      grant_type: grantType,
      ...params,
    };

    this.logger.info('Authenticating on auth API', this.logMeta(requestId));
    const response =
      await this.httpProvider.post<authenticationProviderHttpResponse>(
        this.generateUrl('authenticate'),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          data: qs.stringify(BodyRequest),
        },
      );

    this.logger.info(
      `Authentication done status: ${response.status}`,
      this.logMeta(requestId),
    );

    return {
      success: response.success,
      ...response.data,
    };
  }

  async authenticate(
    authParams: AccountAuthenticationInputDto,
    requestId?: string,
  ) {
    const response = await this.serverAuthenticate(
      'password',
      {
        username: authParams.email,
        password: authParams.password,
      },
      requestId,
    );

    return response;
  }

  async userInfo(accessToken: string, requestId?: string) {
    this.logger.info('Making user info request', this.logMeta(requestId));
    const response = await this.httpProvider.get(this.generateUrl('userInfo'), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    this.logger.info(
      'User info request done successfully',
      this.logMeta(requestId),
    );

    return { success: response.success, userInfo: response.data };
  }

  private async getUserId(
    accessToken: string,
    username: string,
    requestId: string,
  ) {
    this.logger.info('Making get users request', this.logMeta(requestId));

    const url = `${this.generateUrl('getUsers')}?username=${username}`;
    const response = await this.httpProvider.get(url, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    this.logger.info(
      `Get user done status: ${response.status}`,
      this.logMeta(requestId),
    );

    if (!response.success || response.data.length === 0) {
      return { success: false };
    }

    return {
      success: true,
      userId: response.data[0].id,
    };
  }

  async createUser(
    { email, password, firstName, lastName }: CreateUserInputDto,
    requestId?: string,
  ): Promise<IAuthenticationProvider.createUserOutput> {
    const serverResponse = await this.serverAuthenticate(
      'client_credentials',
      {},
      requestId,
    );

    if (!serverResponse.success) return { success: false };

    const url = `${this.generateUrl('createUser')}`;

    const response = await this.httpProvider.post(url, {
      headers: {
        Authorization: `Bearer ${serverResponse.access_token}`,
      },
      data: {
        createdTimestamp: new Date().getTime(),
        username: email,
        email: email,
        emailVerified: true,
        firstName: firstName,
        lastName: lastName,
        enabled: true,
        credentials: [
          {
            type: 'password',
            value: password,
            temporary: false,
          },
        ],
      },
    });

    if (!response.success) {
      return {
        success: false,
      };
    }

    return { success: true };
  }
  async resetPassword(
    { email, password }: ResetUserPasswordInputDto,
    requestId?: string,
  ): Promise<IAuthenticationProvider.resetPasswordOutput> {
    this.logger.info('Making reset password request', this.logMeta(requestId));

    const serverResponse = await this.serverAuthenticate(
      'client_credentials',
      {},
      requestId,
    );

    if (!serverResponse.success) return { success: false };

    const getUsersResponse = await this.getUserId(
      serverResponse.access_token,
      email,
      requestId,
    );

    if (!getUsersResponse.success) return { success: false };
    const { userId } = getUsersResponse;

    const url = `${this.generateUrl('getUsers')}/${userId}/reset-password`;

    const response = await this.httpProvider.put(url, {
      headers: {
        Authorization: `Bearer ${serverResponse.access_token}`,
      },
      data: {
        type: 'password',
        value: password,
        temporary: false,
      },
    });

    this.logger.info(
      `Reset password done status: ${response.status}`,
      this.logMeta(requestId),
    );

    return { success: response.success };
  }

  async logOut(userId: string, requestId?: string) {
    this.logger.info('Starting logout process', this.logMeta(requestId));
    const serverResponse = await this.serverAuthenticate(
      'client_credentials',
      {},
      requestId,
    );

    if (!serverResponse.success)
      return {
        success: false,
        error: 'could not authenticate service account',
      };

    const { access_token } = serverResponse;
    const response =
      await this.httpProvider.post<authenticationProviderHttpResponse>(
        this.generateUrl('logOut', { userId }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Bearer ${access_token}`,
          },
          data: {},
        },
      );

    if (!response.success) {
      this.logger.error(
        `Could not logout user ${userId}, status: ${response.status}`,
        this.logMeta(requestId),
      );
      return { success: false, error: `could not logout user ${userId}` };
    }
    this.logger.info(
      `Logout user ${userId} done status: ${response.status}`,
      this.logMeta(requestId),
    );
    return Promise.resolve({ success: true });
  }

  async refreshSession(
    refreshToken: string,
    requestId?: string,
  ): Promise<IAuthenticationProvider.refreshSessionOutput> {
    this.logger.info(
      'Starting refresh session process',
      this.logMeta(requestId),
    );

    const authResponse = await this.serverAuthenticate(
      'refresh_token',
      { refresh_token: refreshToken },
      requestId,
    );

    if (authResponse.success === false) {
      this.logger.error(
        `Refresh session failed, error: ${authResponse.error_description}`,
        this.logMeta(requestId),
      );
      return { success: false, error: authResponse.error_description };
    }

    this.logger.info('Refresh session successfully', this.logMeta(requestId));

    return {
      success: true,
      accessToken: authResponse.access_token,
      expiresInAccessToken: authResponse.expires_in,
      refreshToken: authResponse.refresh_token,
      expiresInRefreshToken: authResponse.refresh_expires_in,
    };
  }

  private generateUrl(endpointNick: string, urlParams?: UrlParams) {
    const endpoints = {
      createUser: `/auth/admin/realms/${this.KEYCLOAK_REALM}/users`,
      authenticate: `/auth/realms/${this.KEYCLOAK_REALM}/protocol/openid-connect/token`,
      userInfo: `/realms/${this.KEYCLOAK_REALM}/protocol/openid-connect/userinfo`,
      getUsers: `/auth/admin/realms/${this.KEYCLOAK_REALM}/users`,
      logOut: `/auth/admin/realms/${this.KEYCLOAK_REALM}/users/${urlParams?.userId}/logout`,
    };

    const endpoint = endpoints[endpointNick];

    if (!endpoint) {
      const message = `No endpoint entry available for ${endpointNick}`;
      this.logger.error(message);
      throw new Error(message);
    }

    return `${this.KEYCLOAK_BASE_URL}${endpoint}`;
  }
}

type UrlParams = {
  userId?: string;
};
