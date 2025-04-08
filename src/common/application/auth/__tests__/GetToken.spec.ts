import { TokenService } from '../GetToken';
import * as configHelpersMock from '../../../domain/config-helpers';

describe('TokenService', () => {
  let tokenService: TokenService;

  beforeEach(() => {
    tokenService = new TokenService();
  });

  describe('getMicrosoftTokenResponse', () => {
    beforeEach(() => {
      spyOn(tokenService, 'getNewTokenResponse').and.callThrough();
      spyOn(tokenService, 'isJWTExpired').and.callThrough();
    });

    it('should return a new token when no token is cached', async () => {
      tokenService.getNewTokenResponse = jasmine.createSpy().and.returnValue(Promise.resolve({
        data: {
          access_token: 'new_token',
          expires_in: '3600',
          token_type: 'Bearer',
          scope: 'mock_scope',
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      }));

      const result = await tokenService.getMicrosoftTokenResponse();
      expect(result.access_token).toEqual('new_token');
    });

    it('should return a new token when the cached token is expired', async () => {
      tokenService.getNewTokenResponse = jasmine.createSpy().and.returnValue(Promise.resolve({
        data: {
          access_token: 'new_token',
          expires_in: '3600',
          token_type: 'Bearer',
          scope: 'mock_scope',
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      }));

      tokenService.isJWTExpired = jasmine.createSpy().and.returnValue(true);

      const result = await tokenService.getMicrosoftTokenResponse();
      expect(result.access_token).toEqual('new_token');
    });
  });

  describe('getSecrets', () => {
    it('should get secrets from AWS Secrets Manager', async () => {
      process.env.SECRET_NAME = 'test_secret_name';
      const mockSecrets = {
        CLIENT_ID: 'aws_client_id',
        CLIENT_SECRET: 'aws_client_secret',
        API_KEY: 'aws_api_key',
      };

      spyOn(configHelpersMock, 'getEnvSecrets').and.returnValue(Promise.resolve(mockSecrets));

      await tokenService.getSecrets();

      expect(tokenService.clientId).toEqual('aws_client_id');
      expect(tokenService.clientSecret).toEqual('aws_client_secret');
      expect(tokenService.apiKey).toEqual('aws_api_key');
    });
  });
});
