import { loggerMeta } from '@/config/loggerMeta';
import { IForgotPasswordUseCaseProtocol } from '@/domain/protocols/forgotPasswordUseCaseProtocol';
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

@ApiTags('Password')
@Controller('/auth')
export class ForgoPasswordController {
  private readonly logMeta = loggerMeta(ForgoPasswordController.name);
  constructor(
    @Inject(IForgotPasswordUseCaseProtocol.TOKEN)
    private readonly forgotPasswordUseCase: IForgotPasswordUseCaseProtocol,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @ApiOperation({
    summary: 'Forgot password user',
  })
  @Post('/password/forgot')
  @HttpCode(200)
  async signIn(@Body() forgotPasswordDto: any, @RequestId() requestId: string) {
    this.logger.info('Starting forgot password', this.logMeta(requestId));

    const forgotPasswordResult = await this.forgotPasswordUseCase.exec(
      forgotPasswordDto,
      requestId,
    );

    if (forgotPasswordResult.success === false) {
      throw new UnauthorizedException(forgotPasswordResult.error);
    }

    return forgotPasswordResult;
  }
}
