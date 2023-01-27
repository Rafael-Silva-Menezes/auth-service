import { Transporter } from 'nodemailer';
import { SendEmailInput, SendEmailResponse } from '../dtos/mailProviderDto';
import { IMailProvider } from '../protocols/mailProvider';
import { ITemplateProvider } from '../protocols/templateProvider';
import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { loggerMeta } from '@/config/loggerMeta';
import * as nodemailer from 'nodemailer';
import { IEnvProvider } from '@/infra/protocols/envProvider';

@Injectable()
export class MailProvider implements IMailProvider {
  private readonly logMeta = loggerMeta(MailProvider.name);

  constructor(
    private readonly clientEmail: Transporter,
    @Inject(ITemplateProvider.TOKEN)
    private readonly mailTemplateProvider: ITemplateProvider,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  static async asyncFactory(
    envProvider: IEnvProvider,
    templateProvider: ITemplateProvider,
    logger: Logger,
  ): Promise<MailProvider> {
    const account = await nodemailer.createTestAccount();

    const mailer = nodemailer.createTransport({
      host: account.smtp.host,
      port: account.smtp.port,
      secure: account.smtp.secure,
      auth: {
        user: account.user,
        pass: account.pass,
      },
    });

    const mailProvider = new MailProvider(mailer, templateProvider, logger);
    return mailProvider;
  }

  async sendEmail<T>(
    input: SendEmailInput<T>,
    requestId?: string,
  ): Promise<SendEmailResponse> {
    const { from, to, subject, templateData } = input;
    try {
      this.logger.info('Processing email template', this.logMeta(requestId));
      const emailBody = await this.mailTemplateProvider.parse<T>(templateData);
      this.logger.info(
        'Email template processed successfully',
        this.logMeta(requestId),
      );

      this.logger.info('Sending email', this.logMeta(requestId));

      const info = await this.clientEmail.sendMail({
        from: from,
        to: to,
        subject: subject,
        html: emailBody,
      });

      this.logger.info('Email sent successfully', this.logMeta(requestId));

      return {
        messageId: info.messageId,
        link: String(nodemailer.getTestMessageUrl(info)),
        success: true,
      };
    } catch (error) {
      this.logger.error(
        `Could not send email to ${to.split('@')[0]}`,
        this.logMeta(requestId),
      );
      return { success: false };
    }
  }
}
