import { loggerMeta } from '@/config/loggerMeta';
import { IResetPasswordUseCaseProtocol } from '@/domain/protocols/resetPasswordUseCaseProtocol';
import { RequestId } from '@/presentation/decorators/requestIdDecorator';
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Inject,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@ApiTags('Password')
@Controller('/auth')
export class ResetPasswordController {
  private readonly logMeta = loggerMeta(ResetPasswordController.name);
  constructor(
    @Inject(IResetPasswordUseCaseProtocol.TOKEN)
    private readonly resetPasswordUseCase: IResetPasswordUseCaseProtocol,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @ApiOperation({
    summary: 'Reset password user',
  })
  @Put('/password/reset')
  @HttpCode(200)
  async resetPassword(
    @Body() resetPasswordDto: any,
    @RequestId() requestId: string,
  ) {
    this.logger.info('Starting reset password', this.logMeta(requestId));

    const resetPasswordResult = await this.resetPasswordUseCase.exec(
      resetPasswordDto,
      requestId,
    );

    if (resetPasswordResult.success === false) {
      throw new BadRequestException('Error in reset password process');
    }

    return resetPasswordResult;
  }
}
