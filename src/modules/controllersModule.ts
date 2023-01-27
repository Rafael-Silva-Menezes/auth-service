import { Module } from '@nestjs/common';
import { UseCasesModules } from './useCasesModule';
import { ProvidersModule } from './providersModule';
import { SignUpController } from '@/presentation/controllers/signUp/signUpController';
import { SignInController } from '@/presentation/controllers/signIn/signInController';
import { ForgoPasswordController } from '@/presentation/controllers/forgotPassword/forgotPasswordController';
import { ResetPasswordController } from '@/presentation/controllers/resetPassword/resetPasswordControler';
import { LogoutController } from '@/presentation/controllers/logout/logoutController';
import { RefreshSessionController } from '@/presentation/controllers/refreshSession/refreshSessionController';

@Module({
  imports: [UseCasesModules, ProvidersModule],
  controllers: [
    SignUpController,
    SignInController,
    ForgoPasswordController,
    ResetPasswordController,
    LogoutController,
    RefreshSessionController,
  ],
})
export class ControllersModule {}
