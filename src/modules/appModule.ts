import { MiddlewareConsumer, Module } from '@nestjs/common';
import { requestIdMiddleware } from '@/presentation/middlewares/requestIdMiddleware';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from '../config/logger';
import { ControllersModule } from './controllersModule';
import { MongoModule } from './mongoModule';

@Module({
  imports: [
    WinstonModule.forRoot(winstonConfig),
    MongoModule,
    ControllersModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(requestIdMiddleware).forRoutes('*');
  }
}
