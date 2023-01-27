import { ILogoutUseCaseProtocol } from '@/domain/protocols/logoutUseCaseProtocol';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { loggerMeta } from '@/config/loggerMeta';
import {
  Body,
  Controller,
  HttpCode,
  Inject,
  Post,
  UnauthorizedException,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RequestId } from '@/presentation/decorators/requestIdDecorator';
import { UserInterceptor } from '@/presentation/interceptors/userInterceptor';

@ApiTags('Session')
@Controller('/auth')
export class LogoutController {
  private readonly logMeta = loggerMeta(LogoutController.name);
  constructor(
    @Inject(ILogoutUseCaseProtocol.TOKEN)
    private readonly logoutUseCase: ILogoutUseCaseProtocol,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @ApiOperation({
    summary: 'Logout user',
  })
  @UseInterceptors(UserInterceptor)
  @Post('/session/logout')
  @HttpCode(200)
  async logout(@Body() logoutDto: any, @RequestId() requestId: string) {
    this.logger.info('Starting logout process', this.logMeta(requestId));

    const startLogoutResult = await this.logoutUseCase.exec(
      {
        userId: logoutDto.user.sub,
      },
      requestId,
    );
    if (startLogoutResult.success === false) {
      throw new UnauthorizedException('Unauthorized');
    }

    return true;
  }
}
