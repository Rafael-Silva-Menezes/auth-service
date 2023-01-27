import handlebars from 'handlebars';
import { ParseTemplateDto } from '../dtos/templateProviderDto';
import { ITemplateProvider } from '../protocols/templateProvider';

export class TemplateProvider implements ITemplateProvider {
  async parse<T>({ file, variables }: ParseTemplateDto<T>): Promise<string> {
    const parseTemplate = handlebars.compile(file);
    return parseTemplate(variables);
  }
}
