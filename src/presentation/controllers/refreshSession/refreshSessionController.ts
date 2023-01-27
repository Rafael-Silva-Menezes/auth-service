import { loggerMeta } from '@/config/loggerMeta';
import { IRefreshSessionUseCaseProtocol } from '@/domain/protocols/refreshSessionUseCaseProtocol';
import { RequestId } from '@/presentation/decorators/requestIdDecorator';
import {
  BadRequestException,
  Body,
  Controller,
  Inject,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@ApiTags('Session')
@Controller('/auth')
export class RefreshSessionController {
  private readonly logMeta = loggerMeta(RefreshSessionController.name);
  constructor(
    @Inject(IRefreshSessionUseCaseProtocol.TOKEN)
    private readonly refrehSessionUserUseCase: IRefreshSessionUseCaseProtocol,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @ApiOperation({
    summary: 'Get a new pair of tokens',
  })
  @Post('/session/refresh')
  async refreshSession(
    @Body() refreshSessionDto: any,
    @RequestId() requestId: string,
  ) {
    this.logger.info(
      'Starting refresh session process',
      this.logMeta(requestId),
    );

    const refrehSessionResult = await this.refrehSessionUserUseCase.exec(
      refreshSessionDto,
      requestId,
    );

    if (refrehSessionResult.success === false) {
      throw new BadRequestException(refrehSessionResult.error);
    }

    return { success: true, ...refrehSessionResult };
  }
}
