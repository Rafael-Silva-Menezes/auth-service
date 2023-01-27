import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { User, UserDocument } from './schemas/userSchena';
import { IUserRepository } from '../protocols/userRepository';
import { loggerMeta } from '@/config/loggerMeta';

@Injectable()
export class UserRepository implements IUserRepository {
  private readonly logMeta = loggerMeta(UserRepository.name);
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async storeUser(
    { email, name }: IUserRepository.storeUserInput,
    requestId?: string,
  ): Promise<boolean> {
    this.logger.info('Storing User on database', this.logMeta(requestId));
    const storeResponse = await this.userModel.create({
      email,
      name,
    });

    if (!storeResponse._id) {
      this.logger.error('Could not store User!', this.logMeta(requestId));
      return false;
    } else {
      this.logger.info('Storing User successfully', this.logMeta(requestId));
      return true;
    }
  }

  async insertExpiresOnTime(
    { email, expiresOn }: IUserRepository.insertExpiresOnTimeInput,
    requestId?: string,
  ): Promise<boolean> {
    const emailQuery = this.userModel.updateOne(
      { email },
      {
        $set: {
          resetPasswordExpiresOn: expiresOn,
        },
      },
      { upsert: true },
    );

    this.logger.info(
      'Setting up password reset expiresOnTime',
      this.logMeta(requestId),
    );

    const queryResult = await emailQuery.exec();
    console.log(queryResult);
    if (queryResult) {
      this.logger.info(
        'Password reset info configured successfully',
        this.logMeta(requestId),
      );
      return true;
    } else {
      this.logger.error(
        'Could not configure password reset info!',
        this.logMeta(requestId),
      );
      return false;
    }
  }

  async getExpiresOnTime(
    email: string,
    requestId?: string,
  ): Promise<IUserRepository.getExpiresOnTimeOutput> {
    const getExpiresOnTimeQuery = this.userModel.findOne(
      {
        email,
      },
      ['resetPasswordExpiresOn'],
    );

    const queryResult = await getExpiresOnTimeQuery.exec();

    if (queryResult) {
      this.logger.info(
        'Expires time found in database',
        this.logMeta(requestId),
      );

      return {
        resetPasswordExpiresOn: queryResult.resetPasswordExpiresOn,
      };
    } else {
      this.logger.info(
        'Reset password token not found in database',
        this.logMeta(requestId),
      );
      return null;
    }
  }
}
