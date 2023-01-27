import { IAuthenticationProvider } from '@/infra/protocols/authenticationProvider';
import { Inject, Injectable } from '@nestjs/common';
import { ISignUpUseCaseProtocol } from '../protocols/signUpUseCaseProtocol';
import { IUserRepository } from '@/infra/protocols/userRepository';
import {
  SignUpUseCaseInput,
  SignUpUseCaseOutput,
} from '../dtos/signUpUseCaseDto';

@Injectable()
export class SignUpUseCase implements ISignUpUseCaseProtocol {
  constructor(
    @Inject(IAuthenticationProvider.TOKEN)
    private readonly authenticationProvider: IAuthenticationProvider,
    @Inject(IUserRepository.TOKEN)
    private readonly userRepository: IUserRepository,
  ) {}

  async exec(
    input: SignUpUseCaseInput,
    requestId?: string,
  ): Promise<SignUpUseCaseOutput> {
    const createUserResult = await this.authenticationProvider.createUser(
      input,
      requestId,
    );

    if (!createUserResult.success) {
      return { success: false };
    }

    await this.userRepository.storeUser({
      email: input.email,
      name: `${input.firstName} ${input.lastName}`,
    });

    return { success: true };
  }
}
