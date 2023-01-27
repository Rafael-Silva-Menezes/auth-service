import { User, UserSchema } from '@/infra/data/schemas/userSchena';
import { UserRepository } from '@/infra/data/userRepository';
import { IUserRepository } from '@/infra/protocols/userRepository';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [
    {
      provide: IUserRepository.TOKEN,
      useClass: UserRepository,
    },
  ],
  exports: [IUserRepository.TOKEN],
})
export class RepositoryModule {}
