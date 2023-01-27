import { loggerMeta } from '@/config/loggerMeta';
import { ISignInUseCaseProtocol } from '@/domain/protocols/signInUseCaseProtocol';
import { RequestId } from '@/presentation/decorators/requestIdDecorator';
import {
  Body,
  Controller,
  HttpCode,
  Inject,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@ApiTags('Authenticate')
@Controller('/auth')
export class SignInController {
  private readonly logMeta = loggerMeta(SignInController.name);
  constructor(
    @Inject(ISignInUseCaseProtocol.TOKEN)
    private readonly signInUseCase: ISignInUseCaseProtocol,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @ApiOperation({
    summary: 'Login user in system',
  })
  @Post('/signin')
  @HttpCode(200)
  async signIn(@Body() signInDto: any, @RequestId() requestId: string) {
    this.logger.info('Starting sign in', this.logMeta(requestId));

    const signInResult = await this.signInUseCase.exec(signInDto, requestId);

    if (signInResult.success === false) {
      throw new UnauthorizedException(signInResult.error);
    }

    return signInResult;
  }
}
