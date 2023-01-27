export type RefreshSessionDto = {
  refreshToken: string;
};

export type RefreshSessionResultDto =
  | RefreshSessionSuccessOutput
  | RefreshSessionErrorOutput;

type RefreshSessionErrorOutput = {
  success: false;
  error: string;
};

type RefreshSessionSuccessOutput = {
  success: true;
  accessToken: string;
  expiresInAccessToken: number;
  refreshToken: string;
  expiresInRefreshToken: number;
};
