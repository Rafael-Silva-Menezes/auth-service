import { Inject, Injectable } from '@nestjs/common';

import { LogoutDto } from '../dtos/logoutDto';
import { IAuthenticationProvider } from '@/infra/protocols/authenticationProvider';
import { ILogoutUseCaseProtocol } from '../protocols/logoutUseCaseProtocol';

@Injectable()
export class LogoutUseCase implements ILogoutUseCaseProtocol {
  constructor(
    @Inject(IAuthenticationProvider.TOKEN)
    private readonly authenticationProvider: IAuthenticationProvider,
  ) {}

  async exec({ userId }: LogoutDto, requestId?: string) {
    const logoutAuthentication = await this.authenticationProvider.logOut(
      userId,
      requestId,
    );

    if (!logoutAuthentication.success) {
      return { success: false, error: `could not logout user ${userId}` };
    }
    return { success: true };
  }
}
