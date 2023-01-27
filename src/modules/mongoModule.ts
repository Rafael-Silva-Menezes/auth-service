import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoService } from '@/infra/data/mongoService';
import { ProvidersModule } from './providersModule';
import { IEnvProvider } from '@/infra/protocols/envProvider';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ProvidersModule],
      useFactory: async (envProvider: IEnvProvider) => ({
        uri: await envProvider.get('MONGO_URL'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxIdleTimeMS: 270000,
        minPoolSize: 2,
        maxPoolSize: 10,
      }),
      inject: [{ token: IEnvProvider.TOKEN, optional: false }],
    }),
  ],
  providers: [MongoService],
  exports: [MongoService],
})
export class MongoModule {}
