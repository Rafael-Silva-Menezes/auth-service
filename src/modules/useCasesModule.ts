import { Module } from '@nestjs/common';

import { ProvidersModule } from './providersModule';
import { ISignInUseCaseProtocol } from '@/domain/protocols/signInUseCaseProtocol';
import { SignInUseCase } from '@/domain/useCases/signInUseCase';
import { SignUpUseCase } from '@/domain/useCases/signUpUseCase';
import { IForgotPasswordUseCaseProtocol } from '@/domain/protocols/forgotPasswordUseCaseProtocol';
import { ForgotPasswordUseCase } from '@/domain/useCases/forgotPasswordUseCase';
import { IResetPasswordUseCaseProtocol } from '@/domain/protocols/resetPasswordUseCaseProtocol';
import { ResetPasswordUseCase } from '@/domain/useCases/resetPasswordUseCase';
import { ILogoutUseCaseProtocol } from '@/domain/protocols/logoutUseCaseProtocol';
import { LogoutUseCase } from '@/domain/useCases/logoutUseCase';
import { IRefreshSessionUseCaseProtocol } from '@/domain/protocols/refreshSessionUseCaseProtocol';
import { RefreshSessionUseCase } from '@/domain/useCases/refreshSessionUseCase';
import { ISignUpUseCaseProtocol } from '@/domain/protocols/signUpUseCaseProtocol';
import { RepositoryModule } from './repositoryModule';

@Module({
  imports: [ProvidersModule, RepositoryModule],
  providers: [
    {
      provide: ISignUpUseCaseProtocol.TOKEN,
      useClass: SignUpUseCase,
    },
    {
      provide: ISignInUseCaseProtocol.TOKEN,
      useClass: SignInUseCase,
    },
    {
      provide: IForgotPasswordUseCaseProtocol.TOKEN,
      useClass: ForgotPasswordUseCase,
    },
    {
      provide: IResetPasswordUseCaseProtocol.TOKEN,
      useClass: ResetPasswordUseCase,
    },
    {
      provide: ILogoutUseCaseProtocol.TOKEN,
      useClass: LogoutUseCase,
    },
    {
      provide: IRefreshSessionUseCaseProtocol.TOKEN,
      useClass: RefreshSessionUseCase,
    },
  ],
  exports: [
    ISignUpUseCaseProtocol.TOKEN,
    ISignInUseCaseProtocol.TOKEN,
    IForgotPasswordUseCaseProtocol.TOKEN,
    IResetPasswordUseCaseProtocol.TOKEN,
    ILogoutUseCaseProtocol.TOKEN,
    IRefreshSessionUseCaseProtocol.TOKEN,
  ],
})
export class UseCasesModules {}
