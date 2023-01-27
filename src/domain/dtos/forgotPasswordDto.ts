export type UserForgotPasswordDto = {
  email: string;
};

type ForgotPasswordErrorDto = {
  success: false;
  error: string;
};

type ForgotPasswordSuccessDto = {
  success: true;
  link: string;
  messageId: string;
};

export type ForgotPasswordResultDto =
  | ForgotPasswordErrorDto
  | ForgotPasswordSuccessDto;
