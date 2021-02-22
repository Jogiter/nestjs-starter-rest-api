import { Test, TestingModule } from '@nestjs/testing';

import { AuthController } from './auth.controller';
import { AuthService } from '../services/auth.service';
import { RegisterInput } from '../dtos/auth-register-input.dto';
import { LoginInput } from '../dtos/auth-login-input.dto';
import { RefreshTokenInput } from '../dtos/auth-refresh-token-input.dto';
import {
  AuthTokenOutput,
  UserRefreshTokenClaims,
} from '../dtos/auth-token-output.dto';
import { RequestContext } from '../../shared/request-context/request-context.dto';
import { AppLogger } from '../../shared/logger/logger.service';

describe('AuthController', () => {
  let moduleRef: TestingModule;
  let authController: AuthController;

  const mockedAuthService = {
    register: jest.fn(),
    login: jest.fn(),
    refreshToken: jest.fn(),
  };

  const mockedLogger = { setContext: jest.fn(), logWithContext: jest.fn() };

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockedAuthService },
        { provide: AppLogger, useValue: mockedLogger },
      ],
    }).compile();

    authController = moduleRef.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  const ctx = new RequestContext();

  describe('registerLocal', () => {
    it('should register new user', async () => {
      const registerInputDto = new RegisterInput();
      registerInputDto.name = 'John Doe';
      registerInputDto.username = 'john@example.com';
      registerInputDto.password = '123123';

      jest
        .spyOn(mockedAuthService, 'register')
        .mockImplementation(async () => null);

      expect(await authController.registerLocal(ctx, registerInputDto)).toEqual(
        {
          data: null,
          meta: {},
        },
      );
    });
  });

  describe('login', () => {
    it('should login user', async () => {
      const loginInputDto = new LoginInput();
      loginInputDto.username = 'john@example.com';
      loginInputDto.password = '123123';

      const reqObject: any = {};

      jest.spyOn(mockedAuthService, 'login').mockImplementation(() => null);

      expect(await authController.login(ctx, reqObject, loginInputDto)).toEqual(
        {
          data: null,
          meta: {},
        },
      );
    });
  });

  describe('refreshToken', () => {
    let tokenUser: UserRefreshTokenClaims;
    let refreshTokenInputDto: RefreshTokenInput;
    let authToken: AuthTokenOutput;
    let request: any;

    beforeEach(() => {
      tokenUser = { id: 1 };
      refreshTokenInputDto = {
        refreshToken: 'refresh_token',
      };
      authToken = {
        accessToken: 'new_access_token',
        refreshToken: 'new_refresh_token',
      };
      request = {
        user: tokenUser,
      };

      jest
        .spyOn(mockedAuthService, 'refreshToken')
        .mockImplementation(async () => authToken);
    });

    it('should generate refresh token', async () => {
      const response = await authController.refreshToken(
        ctx,
        request,
        refreshTokenInputDto,
      );

      expect(mockedAuthService.refreshToken).toBeCalledWith(ctx, tokenUser);
      expect(response.data).toEqual(authToken);
    });

    afterEach(() => {
      jest.resetAllMocks();
    });
  });
});
