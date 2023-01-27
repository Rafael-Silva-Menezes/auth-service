import { IAuthenticationProvider } from '@/infra/protocols/authenticationProvider';
import { IEnvProvider } from '@/infra/protocols/envProvider';
import { IHttpProvider } from '@/infra/protocols/httpProvider';
import { IMailProvider } from '@/infra/protocols/mailProvider';
import { ITemplateProvider } from '@/infra/protocols/templateProvider';
import { AuthenticationProvider } from '@/infra/providers/authenticationProvider';
import { AxiosHttpProvider } from '@/infra/providers/axiosHttpProvider';
import { EnvProvider } from '@/infra/providers/envProvider';
import { MailProvider } from '@/infra/providers/mailProvider';
import { TemplateProvider } from '@/infra/providers/templateProvider';
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Module({
  providers: [
    JwtService,
    {
      provide: IHttpProvider.TOKEN,
      useFactory: (logger: Logger) => new AxiosHttpProvider(axios, logger),
      inject: [{ token: WINSTON_MODULE_PROVIDER, optional: false }],
    },
    {
      provide: IAuthenticationProvider.TOKEN,
      useClass: AuthenticationProvider,
    },
    {
      provide: IMailProvider.TOKEN,
      useFactory: MailProvider.asyncFactory,
      inject: [
        { token: IEnvProvider.TOKEN, optional: false },
        { token: ITemplateProvider.TOKEN, optional: false },
        { token: WINSTON_MODULE_PROVIDER, optional: false },
      ],
    },
    {
      provide: ITemplateProvider.TOKEN,
      useClass: TemplateProvider,
    },
    {
      provide: IEnvProvider.TOKEN,
      useFactory: async (logger: Logger) => {
        return await EnvProvider.asyncFactory(
          logger,
          new SecretManagerServiceClient(),
        );
      },
      inject: [{ token: WINSTON_MODULE_PROVIDER, optional: false }],
    },
  ],
  exports: [
    JwtService,
    IAuthenticationProvider.TOKEN,
    IMailProvider.TOKEN,
    ITemplateProvider.TOKEN,
    IEnvProvider.TOKEN,
  ],
})
export class ProvidersModule {}
