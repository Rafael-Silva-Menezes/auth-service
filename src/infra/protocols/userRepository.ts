export interface IUserRepository {
  insertExpiresOnTime(
    input: IUserRepository.insertExpiresOnTimeInput,
    requestId?: string,
  ): Promise<boolean>;

  getExpiresOnTime(
    email: string,
    requestId?: string,
  ): Promise<IUserRepository.getExpiresOnTimeOutput>;

  storeUser(
    input: IUserRepository.storeUserInput,
    requestId?: string,
  ): Promise<boolean>;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace IUserRepository {
  export const TOKEN = 'IUserRepository';

  export type insertExpiresOnTimeInput = {
    email: string;
    expiresOn: Date;
  };

  export type getExpiresOnTimeOutput = {
    resetPasswordExpiresOn: Date;
  } | null;

  export type storeUserInput = {
    name: string;
    email: string;
  };
}
