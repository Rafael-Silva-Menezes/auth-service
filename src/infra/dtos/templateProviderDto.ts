export type TemplateVariables = {
  [key: string]: string | number;
};

export type ParseTemplateDto<T> = {
  file: string;
  variables: T;
};
