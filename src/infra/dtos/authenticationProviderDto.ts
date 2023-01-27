export type CreateUserInputDto = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};
export type AccountAuthenticationInputDto = {
  email: string;
  password: string;
};

export type ResetUserPasswordInputDto = {
  email: string;
  password: string;
};

export type ServerAuthenticationParamsInputDto =
  Partial<KeycloakAuthenticationOptionalParams>;

export type KeycloakAuthenticationOptionalParams = {
  refresh_token: string;
  username: string;
  password: string;
  scope: string;
};
