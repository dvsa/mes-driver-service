import { DriverStandard } from '@dvsa/mes-driver-schema';
import { axiosInstance, findStandardDriver } from '../FindStandardDriverData';
import { TokenService } from '../../auth/GetToken';
import * as DriverEndpoint from '../../../framework/DriverEndpoint';

describe('findStandardDriver', () => {
  const mockDriverStandardData: DriverStandard = {
    driverNumber: 'SMITH12345AB1CD',
    title: 'Mr',
    forename: 'John',
    surname: 'Smith',
    dateOfBirth: '1990-01-01',
    postcode: 'AB1 2CD',
  } as unknown as DriverStandard;

  beforeEach(() => {
    spyOn(DriverEndpoint, 'getDriverBaseEndpoint').and.returnValue('https://mock-driver-api');
    // eslint-disable-next-line no-unused-vars
    spyOn(TokenService.prototype, 'getSecrets').and.callFake(function setApiKey(this: TokenService) {
      this.apiKey = 'mock-api-key';
      return Promise.resolve();
    });
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
    it('should return the standard driver data', async () => {
      spyOn(axiosInstance, 'post').and.returnValue(
        Promise.resolve({ status: 200, data: mockDriverStandardData }),
      );

      const result = await findStandardDriver('SMITH12345AB1CD', 'REF123');

      expect(result).toEqual(mockDriverStandardData);
    });
  });

  describe('when the upstream returns 404', () => {
    it('should return null', async () => {
      spyOn(axiosInstance, 'post').and.returnValue(
        Promise.resolve({ status: 404, data: null }),
      );

      const result = await findStandardDriver('SMITH12345AB1CD', 'REF123');

      expect(result).toBeNull();
    });
  });

  describe('when the request includes the correct headers', () => {
    it('should call post with Authorization and x-api-key headers', async () => {
      const postSpy = spyOn(axiosInstance, 'post').and.returnValue(
        Promise.resolve({ status: 200, data: mockDriverStandardData }),
      );

      await findStandardDriver('SMITH12345AB1CD', 'REF123');

      const [, , config] = postSpy.calls.mostRecent().args;
      expect(config!.headers!.Authorization).toBe('mock-token');
      expect(config!.headers!['x-api-key']).toBe('mock-api-key');
    });

    it('should call post with the correct URL', async () => {
      const postSpy = spyOn(axiosInstance, 'post').and.returnValue(
        Promise.resolve({ status: 200, data: mockDriverStandardData }),
      );

      await findStandardDriver('SMITH12345AB1CD', 'REF123');

      const [url] = postSpy.calls.mostRecent().args;
      expect(url).toBe('https://mock-driver-api/driver/standard');
    });

    it('should include both drivingLicenceNumber and enquiryRefNumber in the request body', async () => {
      const postSpy = spyOn(axiosInstance, 'post').and.returnValue(
        Promise.resolve({ status: 200, data: mockDriverStandardData }),
      );

      await findStandardDriver('SMITH12345AB1CD', 'REF123');

      const [, body] = postSpy.calls.mostRecent().args;
      expect(JSON.parse(body as string)).toEqual({
        drivingLicenceNumber: 'SMITH12345AB1CD',
        enquiryRefNumber: 'REF123',
      });
    });
  });
});
