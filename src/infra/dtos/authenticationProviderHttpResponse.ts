export type authenticationProviderHttpResponse =
  | authProviderHttpResponseSuccess
  | authProviderHttpResponseError;

type authProviderHttpResponseSuccess = {
  success: true;
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  refresh_token: string;
  token_type: string;
  id_token: string;
  'not-before-policy': number;
  session_state: string;
  scope: string;
};

type authProviderHttpResponseError = {
  success: false;
  error: string;
  error_description: string;
};
