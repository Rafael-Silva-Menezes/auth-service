export type LogoutDto = {
  userId: string;
};

type LogoutErrorDto = {
  success: boolean;
  error?: string;
};

type LogoutSuccessDto = {
  success: true;
};

export type LogoutResultDto = LogoutSuccessDto | LogoutErrorDto;
