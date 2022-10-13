import { APIGatewayEvent } from 'aws-lambda';
import { It, Mock } from 'typemoq';
import { DriverStandard } from '@dvsa/mes-driver-schema';
import * as GetStandardDriverData from '../../../../common/application/driver/FindStandardDriverData';
import * as createResponse from '../../../../common/application/utils/createResponse';
import * as GetToken from '../../../../common/application/auth/GetToken';
import { MicrosoftResponse } from '../../../../common/domain/token.interface';
import { handler } from '../handler';
import { DriverErrorMessages } from '../../../../common/application/driver/DriverErrMessages';

const lambdaTestUtils = require('aws-lambda-test-utils');

describe('getStandardDriver handler', () => {
  const mockStandardDriverResponse = {
    driver: { lastName: 'dsvsdvsdv' },
  } as DriverStandard;

  let dummyApigwEvent: APIGatewayEvent;
  let createResponseSpy: jasmine.Spy;

  const moqFindStandardDriver = Mock.ofInstance(GetStandardDriverData.findStandardDriver);

  beforeEach(() => {
    moqFindStandardDriver.reset();
    dummyApigwEvent = lambdaTestUtils.mockEventCreator.createAPIGatewayEvent({
      body: JSON.stringify({
        drivingLicenceNumber: '12345678',
        enquiryRefNumber: '123456789',
      }),
    });
    createResponseSpy = spyOn(createResponse, 'default');
    spyOn(GetStandardDriverData, 'findStandardDriver').and.callFake(moqFindStandardDriver.object);
    spyOn(GetToken, 'getMicrosoftTokenResponse').and.returnValue(Promise.resolve({
      access_token: 'abc123',
    } as MicrosoftResponse));
  });

  describe('handler', () => {
    describe('200', () => {
      it('should return a successful response with the payload', async () => {
        moqFindStandardDriver.setup(
          (x) => x(It.isAnyString(), It.isAnyString(), It.isAnyString()),
        ).returns(() => Promise.resolve(mockStandardDriverResponse));

        createResponseSpy.and.returnValue({ statusCode: 200 });

        const resp = await handler(dummyApigwEvent);

        expect(resp.statusCode).toBe(200);
        expect(createResponse.default).toHaveBeenCalledWith(mockStandardDriverResponse, 200);
      });
    });
    describe('404', () => {
      it('should return a 404 not found when GetStandardDriver returns null', async () => {
        moqFindStandardDriver.setup(
          (x) => x(It.isAnyString(), It.isAnyString(), It.isAnyString()),
        ).returns(() => Promise.resolve(null));

        createResponseSpy.and.returnValue({ statusCode: 404 });

        const resp = await handler(dummyApigwEvent);

        expect(resp.statusCode).toBe(404);
        expect(createResponse.default).toHaveBeenCalledWith(DriverErrorMessages.NOT_FOUND, 404);
      });
    });
    describe('400', () => {
      it('should return a 400 when body is invalid', async () => {
        dummyApigwEvent = lambdaTestUtils.mockEventCreator.createAPIGatewayEvent({
          body: JSON.stringify({
            drivingLicenceNumber: '12345678',
          }),
        });

        createResponseSpy.and.returnValue({ statusCode: 400 });

        const resp = await handler(dummyApigwEvent);

        expect(resp.statusCode).toBe(400);
        expect(createResponse.default).toHaveBeenCalledWith(DriverErrorMessages.INVALID, 400);
      });
    });
    describe('500', () => {
      it('should return an internal server error', async () => {
        moqFindStandardDriver.setup(
          (x) => x(It.isAnyString(), It.isAnyString(), It.isAnyString()),
        ).throws(new Error('err'));

        createResponseSpy.and.returnValue({ statusCode: 500 });

        const resp = await handler(dummyApigwEvent);

        expect(resp.statusCode).toBe(500);
        expect(createResponse.default).toHaveBeenCalledWith(DriverErrorMessages.INTERNAL_SERVER_ERROR, 500);
      });
    });
  });
});
