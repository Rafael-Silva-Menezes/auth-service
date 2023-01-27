import { ParseTemplateDto } from '../dtos/templateProviderDto';

export interface ITemplateProvider {
  parse<T>(data: ParseTemplateDto<T>): Promise<string>;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ITemplateProvider {
  export const TOKEN = 'ITemplateProvider';
}
