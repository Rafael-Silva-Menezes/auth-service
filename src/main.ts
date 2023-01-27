import { NestFactory } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './config/logger';
import { AppModule } from './modules/appModule';
import { configureSwagger } from './config/swagger';
import { ValidationPipe } from '@nestjs/common';

const genNestConfig = () => {
  let configObj = {};

  configObj = {
    ...configObj,
    logger: WinstonModule.createLogger(winstonConfig),
  };

  return configObj;
};

async function bootstrap() {
  const port = process.env.PORT || 3000;
  const nestConfig = genNestConfig();
  const app = await NestFactory.create(AppModule, nestConfig);

  configureSwagger(app);

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();

  await app.listen(port);
}
bootstrap();
