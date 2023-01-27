import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { isCloudEnv } from './cloudEnv';

export const configureSwagger = (app: INestApplication) => {
  if (!isCloudEnv()) {
    const config = new DocumentBuilder()
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        'access-token',
      )
      .setTitle('Voltz Business Banking - API')
      .setDescription(
        'BFF utilizado no sistema de internet banking da voltz business',
      )
      .setVersion('0.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }
};
