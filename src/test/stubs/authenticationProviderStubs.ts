export const authHttpSuccessStub = () => ({
  status: 200,
  success: true,
  data: {
    access_token: 'any_token',
    expires_in: 12345,
    refresh_expires_in: 12345,
    refresh_token: 'refresh_token',
    token_type: 'token_type',
    id_token: 'any_token',
    'not-before-policy': 12345,
    session_state: 'session_state',
    scope: 'scope',
  },
});

export const authHttpErrorStub = () => ({
  status: 401,
  success: false,
  data: {
    error: 'invalid_grant',
    error_description: 'Invalid user credentials',
  },
});
