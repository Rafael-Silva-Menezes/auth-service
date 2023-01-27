export type SignInUseCaseInput = {
  email: string;
  password: string;
};

export type SignInUseCaseOutput = SignInUseCaseSuccess | SignInUseCaseError;

type SignInUseCaseSuccess = {
  success: true;
  accessToken: string;
  accessTokenExpiresIn: number;
  refreshTokenExpiresIn: number;
  refreshToken: string;
};
type SignInUseCaseError = {
  success: false;
  error: string;
};
