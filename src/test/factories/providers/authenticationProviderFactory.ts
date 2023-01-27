import { AuthenticationProvider } from '@/infra/providers/authenticationProvider';
import { JwtService } from '@nestjs/jwt';
import { HttpProviderMock } from '@/test/mocks/httpProviderMock';
import { IEnvProvider } from '@/infra/protocols/envProvider';
import * as winston from 'winston';

export const authenticationProviderFactory = (
  envProviderMock: IEnvProvider,
): authenticationProviderFactoryReturn => {
  const jwtService = new JwtService();
  const httpProviderMock = new HttpProviderMock();
  const logger = winston.createLogger({
    transports: [new winston.transports.Console()],
    level: 'error',
  });
  const authenticationProvider = new AuthenticationProvider(
    envProviderMock,
    jwtService,
    httpProviderMock,
    logger,
  );

  return {
    authenticationProvider,
    httpProviderAuth: httpProviderMock,
    authJwtService: jwtService,
  };
};

type authenticationProviderFactoryReturn = {
  authenticationProvider: AuthenticationProvider;
  httpProviderAuth: HttpProviderMock;
  authJwtService: JwtService;
};
