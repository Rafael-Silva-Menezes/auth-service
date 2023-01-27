import { IEnvProvider } from '../protocols/envProvider';
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import { Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { isCloudEnv } from '@/config/cloudEnv';

export class EnvProvider implements IEnvProvider {
  private readonly logMeta = () => ({
    context: EnvProvider.name,
  });
  private envCache: any;

  private constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly project: string,
    private readonly secretClient?: SecretManagerServiceClient,
  ) {}

  private async config() {
    const envList = [
      'MONGO_URL',
      'EMAIL_SYSTEM',
      'SMTP_HOST',
      'SMTP_PORT',
      'SMTP_SECURE',
      'SMTP_USER',
      'SMTP_PASS',
      'FORGOT_PASSWORD_EXPIRES_TIME',
      'KEYCLOAK_BASE_URL',
      'KEYCLOAK_CLIENT_SECRET',
      'KEYCLOAK_CLIENT_ID',
      'KEYCLOAK_REALM',
      'FRONTEND_URL',
    ];

    const envPromises = envList.map(this.fetchValue.bind(this));

    const values = await Promise.all(envPromises);

    const temp: any = {};

    for (let i = 0; i < envList.length; i++) {
      temp[envList[i]] = values[i];
    }

    this.envCache = temp;
  }

  static async asyncFactory(
    logger: Logger,
    secretClient?: SecretManagerServiceClient,
  ) {
    if (!process.env.GCP_PROJECT) {
      throw new Error('No GCP_PROJECT_ID env variable provided');
    }
    const envProvider = new EnvProvider(
      logger,
      process.env.GCP_PROJECT_ID,
      secretClient,
    );

    await envProvider.config();

    return envProvider;
  }

  private async fetchValue(key: string) {
    const envValue = process.env[key];
    if (envValue) return Promise.resolve(envValue);

    this.logger.info(
      `Could not find ${key} on local environment`,
      this.logMeta(),
    );

    let secret: any;

    if (!isCloudEnv()) {
      secret = null;
    } else {
      try {
        secret = await this.accessSecret(key);
      } catch {
        secret = null;
      }
    }
    if (secret) {
      return secret?.payload?.data.toString();
    } else {
      this.logger.error(`Invalid state/value for ${key} `, this.logMeta());
      return null;
    }
  }

  get(key: string) {
    const envValue = this.envCache[key];

    if (!envValue) {
      throw new Error(
        `Could not find a value for ${key} on process env or secret manager`,
      );
    }

    return envValue;
  }

  private generateSecretName(secretKey: string) {
    return `projects/${this.project}/secrets/${secretKey}/versions/latest`;
  }

  private async accessSecret(key: string) {
    this.logger.info(`Accessing secret manager - key: ${key}`, this.logMeta());
    if (this.secretClient) {
      const accessResult = await this?.secretClient.accessSecretVersion({
        name: this.generateSecretName(key),
      });
      this.logger.info(`Secret ${key} successfully gathered`, this.logMeta());
      return accessResult ? accessResult[0] : undefined;
    } else {
      return null;
    }
  }
}
