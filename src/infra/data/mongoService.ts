import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class MongoService {
  constructor(@InjectConnection() private readonly connetion: Connection) {}

  getDbHandler(): Connection {
    return this.connetion;
  }
}
