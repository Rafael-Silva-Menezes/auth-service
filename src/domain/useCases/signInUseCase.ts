import { Inject, Injectable } from '@nestjs/common';
import { ISignInUseCaseProtocol } from '../protocols/signInUseCaseProtocol';
import {
  SignInUseCaseInput,
  SignInUseCaseOutput,
} from '../dtos/signInUseCaseDto';
import { IAuthenticationProvider } from '@/infra/protocols/authenticationProvider';

@Injectable()
export class SignInUseCase implements ISignInUseCaseProtocol {
  constructor(
    @Inject(IAuthenticationProvider.TOKEN)
    private readonly authenticationProvider: IAuthenticationProvider,
  ) {}

  async exec(
    { email, password }: SignInUseCaseInput,
    requestId?: string,
  ): Promise<SignInUseCaseOutput> {
    const authResult = await this.authenticationProvider.authenticate(
      { email, password },
      requestId,
    );

    if (!authResult.success) {
      return { success: false, error: 'Unauthorized user' };
    }

    return {
      success: true,
      accessToken: authResult.access_token,
      accessTokenExpiresIn: authResult.expires_in,
      refreshToken: authResult.refresh_token,
      refreshTokenExpiresIn: authResult.expires_in,
    };
  }
}
