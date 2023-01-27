/* eslint-disable @typescript-eslint/no-namespace */
import { SendEmailInput, SendEmailResponse } from '../dtos/mailProviderDto';

export interface IMailProvider {
  sendEmail<T>(
    input: SendEmailInput<T>,
    requestId?: string,
  ): Promise<SendEmailResponse>;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace IMailProvider {
  export const TOKEN = 'IMailProvider';
}
