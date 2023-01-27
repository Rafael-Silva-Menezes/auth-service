export interface IEnvProvider {
  get(key: string): string;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace IEnvProvider {
  export const TOKEN = 'IEnvProvider';
}
