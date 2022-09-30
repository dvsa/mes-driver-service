import { APIGatewayEvent } from 'aws-lambda';
import { Mock, It } from 'typemoq';
import * as FindDriverSignature from '../../../../common/application/driver/FindDriverSignature';
import { DriverSignature } from '../../../../common/domain/driver-signature.interface';
import * as createResponse from '../../../../common/application/utils/createResponse';
import * as GetToken from '../../../../common/application/auth/GetToken';
import { MicrosoftResponse } from '../../../../common/domain/token.interface';
import { handler } from '../handler';
import { DriverErrorMessages } from '../../../../common/application/driver/DriverErrMessages';

const lambdaTestUtils = require('aws-lambda-test-utils');

describe('getSignature handler', () => {
  const mockSignatureResponse: DriverSignature = {
    signature: {
      image: '/some-img-string-12312321=',
      imageFormat: 'image/jpeg',
    },
  };
  let dummyApigwEvent: APIGatewayEvent;
  let createResponseSpy: jasmine.Spy;

  const moqFindDriverSignature = Mock.ofInstance(FindDriverSignature.findDriverSignature);

  beforeEach(() => {
    moqFindDriverSignature.reset();
    dummyApigwEvent = lambdaTestUtils.mockEventCreator.createAPIGatewayEvent({
      pathParameters: {
        drivingLicenceNumber: '12345678',
      },
    });
    createResponseSpy = spyOn(createResponse, 'default');
    spyOn(FindDriverSignature, 'findDriverSignature').and.callFake(moqFindDriverSignature.object);
    spyOn(GetToken, 'getMicrosoftTokenResponse').and.returnValue(Promise.resolve({
      access_token: 'abc123',
    } as MicrosoftResponse));
  });

  describe('handler', () => {
    describe('200', () => {
      it('should return a successful response with the payload', async () => {
        moqFindDriverSignature.setup(
          (x) => x(It.isAnyString(), It.isAnyString()),
        ).returns(() => Promise.resolve(mockSignatureResponse));

        createResponseSpy.and.returnValue({ statusCode: 200 });

        const resp = await handler(dummyApigwEvent);

        expect(resp.statusCode).toBe(200);
        expect(createResponse.default).toHaveBeenCalledWith(mockSignatureResponse, 200);
      });
    });
    describe('404', () => {
      it('should return a 404 not found when FindDriverSignature returns null', async () => {
        moqFindDriverSignature.setup(
          (x) => x(It.isAnyString(), It.isAnyString()),
        ).returns(() => Promise.resolve(null));

        createResponseSpy.and.returnValue({ statusCode: 404 });

        const resp = await handler(dummyApigwEvent);

        expect(resp.statusCode).toBe(404);
        expect(createResponse.default).toHaveBeenCalledWith(DriverErrorMessages.NOT_FOUND, 404);
      });
    });
    describe('400', () => {
      it('should return a 400 when no path param matching specified is found', async () => {
        dummyApigwEvent = lambdaTestUtils.mockEventCreator.createAPIGatewayEvent({
          pathParameters: {},
        });

        createResponseSpy.and.returnValue({ statusCode: 400 });

        const resp = await handler(dummyApigwEvent);

        expect(resp.statusCode).toBe(400);
        expect(createResponse.default).toHaveBeenCalledWith(DriverErrorMessages.BAD_REQUEST, 400);
      });
    });
    describe('500', () => {
      it('should return an internal server error', async () => {
        moqFindDriverSignature.setup(
          (x) => x(It.isAnyString(), It.isAnyString()),
        ).throws(new Error('err'));

        createResponseSpy.and.returnValue({ statusCode: 500 });

        const resp = await handler(dummyApigwEvent);

        expect(resp.statusCode).toBe(500);
        expect(createResponse.default).toHaveBeenCalledWith(DriverErrorMessages.INTERNAL_SERVER_ERROR, 500);
      });
    });
  });
});
