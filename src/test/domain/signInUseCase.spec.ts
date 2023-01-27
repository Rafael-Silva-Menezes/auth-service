import { SignInUseCase } from '@/domain/useCases/signInUseCase';
import { authenticationProviderFactory } from '../factories/providers/authenticationProviderFactory';
import { EnvProviderMock } from '../mocks/envProviderMock';
import {
  authHttpErrorStub,
  authHttpSuccessStub,
} from '../stubs/authenticationProviderStubs';

describe('SignInUseCase', () => {
  const makeSut = async () => {
    const ENV = {
      KEYCLOAK_BASE_URL: 'keycloak authentication url',
      KEYCLOAK_REALM: 'a keycloak realm',
      KEYCLOAK_CLIENT_SECRET: 'keycloak client secret',
      KEYCLOAK_CLIENT_ID: 'keycloak client id',
    };

    const envProviderMock = new EnvProviderMock(ENV);

    const { httpProviderAuth, authenticationProvider } =
      authenticationProviderFactory(envProviderMock);

    const signInUseCase = new SignInUseCase(authenticationProvider);

    return {
      signInUseCase,
      httpProviderAuth,
    };
  };

  it('Should return "unauthorized user" if user is invalid', async () => {
    const { signInUseCase, httpProviderAuth } = await makeSut();

    httpProviderAuth.post = jest.fn().mockImplementationOnce(authHttpErrorStub);

    const response = await signInUseCase.exec({
      email: 'any@email.com',
      password: '12345',
    });

    expect(response).toEqual({ success: false, error: 'Unauthorized user' });
  });

  it('Should return access_token if valid credentials', async () => {
    const { signInUseCase, httpProviderAuth } = await makeSut();

    httpProviderAuth.post = jest
      .fn()
      .mockImplementationOnce(authHttpSuccessStub);

    const response = await signInUseCase.exec({
      email: 'any@email.com',
      password: '12345',
    });

    expect(response).toEqual({ success: true, accessToken: 'any_token' });
  });
});
