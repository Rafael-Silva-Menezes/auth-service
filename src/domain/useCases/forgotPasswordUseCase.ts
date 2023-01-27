import { IEnvProvider } from '@/infra/protocols/envProvider';
import { IMailProvider } from '@/infra/protocols/mailProvider';
import { Inject, Injectable } from '@nestjs/common';
import {
  UserForgotPasswordDto,
  ForgotPasswordResultDto,
} from '../dtos/forgotPasswordDto';
import { IForgotPasswordUseCaseProtocol } from '../protocols/forgotPasswordUseCaseProtocol';
import { sendPasswordReset } from '@/config/resetPasswordEmailTemplate';
import { IUserRepository } from '@/infra/protocols/userRepository';

@Injectable()
export class ForgotPasswordUseCase implements IForgotPasswordUseCaseProtocol {
  private mailSender: string;
  private urlFront: string;
  private readonly expiresTime: number;

  constructor(
    @Inject(IUserRepository.TOKEN)
    private readonly userRepository: IUserRepository,
    @Inject(IMailProvider.TOKEN)
    private readonly mailProvider: IMailProvider,
    @Inject(IEnvProvider.TOKEN)
    private readonly envProvider: IEnvProvider,
  ) {
    [this.mailSender, this.urlFront, this.expiresTime] = [
      this.envProvider.get('EMAIL_SYSTEM'),
      this.envProvider.get('FRONTEND_URL'),
      Number(this.envProvider.get('FORGOT_PASSWORD_EXPIRES_TIME')),
    ];
  }

  async exec(
    { email }: UserForgotPasswordDto,
    requestId?: string,
  ): Promise<ForgotPasswordResultDto> {
    const expiresOn = await this.generateExpiresOn();

    const configResetPassword = await this.userRepository.insertExpiresOnTime(
      {
        email,
        expiresOn,
      },
      requestId,
    );

    if (!configResetPassword) {
      return {
        success: false,
        error: 'Error in configure reset password',
      };
    }

    const sendEmailResponse = await this.mailProvider.sendEmail(
      {
        from: this.mailSender,
        to: email,
        subject: 'Forgot password link',
        templateData: {
          file: sendPasswordReset,
          variables: {
            link: this.urlFront,
          },
        },
      },
      requestId,
    );

    if (sendEmailResponse.success === false) {
      return {
        success: false,
        error: 'Email cannot be sent',
      };
    }

    return {
      success: true,
      link: sendEmailResponse.link,
      messageId: sendEmailResponse.messageId,
    };
  }

  private async generateExpiresOn(): Promise<Date> {
    return new Date(Date.now() + this.expiresTime);
  }
}
