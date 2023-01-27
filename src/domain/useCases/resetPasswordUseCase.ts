import { Inject, Injectable } from '@nestjs/common';
import { IResetPasswordUseCaseProtocol } from '../protocols/resetPasswordUseCaseProtocol';
import {
  ResetPasswordUseCaseInput,
  ResetPasswordUseCaseOutput,
} from '../dtos/resetPasswordDto';
import { IAuthenticationProvider } from '@/infra/protocols/authenticationProvider';
import { IUserRepository } from '@/infra/protocols/userRepository';

@Injectable()
export class ResetPasswordUseCase implements IResetPasswordUseCaseProtocol {
  constructor(
    @Inject(IUserRepository.TOKEN)
    private readonly userRepository: IUserRepository,
    @Inject(IAuthenticationProvider.TOKEN)
    private readonly authenticationProvider: IAuthenticationProvider,
  ) {}

  async exec(
    { email, newPassword }: ResetPasswordUseCaseInput,
    requestId?: string,
  ): Promise<ResetPasswordUseCaseOutput> {
    const getExpiresOnTime = await this.userRepository.getExpiresOnTime(email);

    if (getExpiresOnTime.resetPasswordExpiresOn.getTime() < Date.now()) {
      return {
        success: false,
      };
    }

    const response = await this.authenticationProvider.resetPassword({
      email,
      password: newPassword,
    });

    if (!response.success) {
      return { success: false };
    }

    return { success: true };
  }
}
