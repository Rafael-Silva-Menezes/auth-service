import { IEnvProvider } from '@/infra/protocols/envProvider';

export class EnvProviderMock implements IEnvProvider {
  constructor(
    private readonly mockedEnv: { [key: string]: string | undefined },
  ) { }

  get(key: string, mockEnv?: { [key: string]: string | undefined }): string {
    let result;
    if (mockEnv) {
      result = mockEnv[key];
    } else {
      result = this.mockedEnv[key];
    }

    if (!result) {
      throw new Error(`No value provided for ${key}`);
    }
    return result;
  }
}
