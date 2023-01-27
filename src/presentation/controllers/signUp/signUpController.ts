import { loggerMeta } from '@/config/loggerMeta';
import { ISignUpUseCaseProtocol } from '@/domain/protocols/signUpUseCaseProtocol';
import { RequestId } from '@/presentation/decorators/requestIdDecorator';
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Inject,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@ApiTags('Authenticate')
@Controller('/auth')
export class SignUpController {
  private readonly logMeta = loggerMeta(SignUpController.name);
  constructor(
    @Inject(ISignUpUseCaseProtocol.TOKEN)
    private readonly singUpUseCase: ISignUpUseCaseProtocol,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @ApiOperation({
    summary: 'Create user in system',
  })
  @Post('/signup')
  @HttpCode(200)
  async signUp(@Body() signUpDto: any, @RequestId() requestId: string) {
    this.logger.info('Starting sign up', this.logMeta(requestId));

    const signUpResult = await this.singUpUseCase.exec(signUpDto, requestId);

    if (!signUpResult.success) {
      throw new BadRequestException('Error in SignUp');
    }

    return true;
  }
}
