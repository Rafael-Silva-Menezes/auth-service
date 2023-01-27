import { IAuthenticationProvider } from '@/infra/protocols/authenticationProvider';
import { Inject, Injectable } from '@nestjs/common';
import { IRefreshSessionUseCaseProtocol } from '../protocols/refreshSessionUseCaseProtocol';
import {
  RefreshSessionDto,
  RefreshSessionResultDto,
} from '../dtos/refreshSessionDto';

@Injectable()
export class RefreshSessionUseCase implements IRefreshSessionUseCaseProtocol {
  constructor(
    @Inject(IAuthenticationProvider.TOKEN)
    private readonly authenticationProvider: IAuthenticationProvider,
  ) {}

  async exec(
    { refreshToken }: RefreshSessionDto,
    requestId?: string,
  ): Promise<RefreshSessionResultDto> {
    const refreshSessionResult =
      await this.authenticationProvider.refreshSession(refreshToken, requestId);

    return refreshSessionResult;
  }
}
