export type SignUpUseCaseInput = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

export type SignUpUseCaseOutput = {
  success: boolean;
};
