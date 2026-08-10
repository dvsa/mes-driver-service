import { DriverSignature } from '@dvsa/mes-driver-schema';
import { axiosInstance, findDriverSignature } from '../FindDriverSignature';
import { TokenService } from '../../auth/GetToken';
import * as DriverEndpoint from '../../../framework/DriverEndpoint';
import * as ConfigHelpers from '../../../domain/config-helpers';

describe('findDriverSignature', () => {
  const mockSignatureData: DriverSignature = {
    signature: {
      image: '/some-sig-string-12312321=',
      imageFormat: 'image/png',
    },
  };

  beforeEach(() => {
    spyOn(DriverEndpoint, 'getDriverBaseEndpoint').and.returnValue('https://mock-driver-api');
    spyOn(ConfigHelpers, 'getEnvSecrets').and.returnValue(
      Promise.resolve({ API_KEY: 'mock-api-key', CLIENT_ID: 'mock-client-id', CLIENT_SECRET: 'mock-client-secret' }),
    );
    spyOn(TokenService.prototype, 'getMicrosoftTokenResponse').and.returnValue(
      Promise.resolve({
        access_token: 'mock-token',
        token_type: 'Bearer',
        expires_in: 3600,
        ext_expires_in: 3600,
      }),
    );
  });

  describe('when the upstream returns 200', () => {
    it('should return the signature data', async () => {
      spyOn(axiosInstance, 'post').and.returnValue(
        Promise.resolve({ status: 200, data: mockSignatureData }),
      );

      const result = await findDriverSignature('SMITH12345AB1CD');

      expect(result).toEqual(mockSignatureData);
    });
  });

  describe('when the upstream returns 404', () => {
    it('should return null', async () => {
      spyOn(axiosInstance, 'post').and.returnValue(
        Promise.resolve({ status: 404, data: null }),
      );

      const result = await findDriverSignature('SMITH12345AB1CD');

      expect(result).toBeNull();
    });
  });

  describe('when the request includes the correct headers', () => {
    it('should call post with Authorization and x-api-key headers', async () => {
      const postSpy = spyOn(axiosInstance, 'post').and.returnValue(
        Promise.resolve({ status: 200, data: mockSignatureData }),
      );

      await findDriverSignature('SMITH12345AB1CD');

      const [, , config] = postSpy.calls.mostRecent().args;
      expect(config!.headers!.Authorization).toBe('mock-token');
      expect(config!.headers!['x-api-key']).toBe('mock-api-key');
    });

    it('should call post with the correct URL', async () => {
      const postSpy = spyOn(axiosInstance, 'post').and.returnValue(
        Promise.resolve({ status: 200, data: mockSignatureData }),
      );

      await findDriverSignature('SMITH12345AB1CD');

      const [url] = postSpy.calls.mostRecent().args;
      expect(url).toBe('https://mock-driver-api/image/signature');
    });
  });
});
