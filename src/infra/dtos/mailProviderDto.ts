import { ParseTemplateDto } from './templateProviderDto';

export type SendEmailInput<T> = {
  to: string;
  from: string;
  subject: string;
  templateData: ParseTemplateDto<T>;
};

export type SendEmailResponse = {
  messageId?: string;
  link?: string;
  success: boolean;
};
