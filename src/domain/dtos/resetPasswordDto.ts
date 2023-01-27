export type ResetPasswordUseCaseInput = {
  email: string;
  newPassword: string;
};

export type ResetPasswordUseCaseOutput = {
  success: boolean;
};
