import { APIGatewayEvent } from 'aws-lambda';
import { It, Mock } from 'typemoq';
import { DriverPhotograph } from '@dvsa/mes-driver-schema';
import * as response from '@dvsa/mes-microservice-common/application/api/create-response';

import * as FindDriverPhotograph from '../../../../common/application/driver/FindDriverPhotograph';
import * as GetToken from '../../../../common/application/auth/GetToken';
import { handler } from '../handler';
import { MicrosoftResponse } from '../../../../common/domain/token.interface';
import { DriverErrorMessages } from '../../../../common/application/driver/DriverErrMessages';

const lambdaTestUtils = require('aws-lambda-test-utils');

describe('getPhotograph handler', () => {
  const mockPhotographResponse: DriverPhotograph = {
    photograph: {
      image: '/some-img-string-12312321=',
      imageFormat: 'image/jpeg',
    },
  };
  let dummyApigwEvent: APIGatewayEvent;
  let createResponseSpy: jasmine.Spy;

  const moqFindDriverPhotograph = Mock.ofInstance(FindDriverPhotograph.findDriverPhotograph);

  beforeEach(() => {
    moqFindDriverPhotograph.reset();
    dummyApigwEvent = lambdaTestUtils.mockEventCreator.createAPIGatewayEvent({
      pathParameters: {
        drivingLicenceNumber: '12345678',
      },
    });
    createResponseSpy = spyOn(response, 'createResponse');
    spyOn(FindDriverPhotograph, 'findDriverPhotograph').and.callFake(moqFindDriverPhotograph.object);
    spyOn(GetToken, 'getMicrosoftTokenResponse').and.returnValue(Promise.resolve({
      access_token: 'abc123',
    } as MicrosoftResponse));
  });

  describe('handler', () => {
    describe('200', () => {
      it('should return a successful response with the payload', async () => {
        moqFindDriverPhotograph.setup(
          (x) => x(It.isAnyString(), It.isAnyString()),
        ).returns(() => Promise.resolve(mockPhotographResponse));

        createResponseSpy.and.returnValue({ statusCode: 200 });

        const resp = await handler(dummyApigwEvent);

        expect(resp.statusCode).toBe(200);
        expect(response.createResponse).toHaveBeenCalledWith(mockPhotographResponse, 200);
      });
    });
    describe('404', () => {
      it('should return a 404 not found when FindDriverPhotograph returns null', async () => {
        moqFindDriverPhotograph.setup(
          (x) => x(It.isAnyString(), It.isAnyString()),
        ).returns(() => Promise.resolve(null));

        createResponseSpy.and.returnValue({ statusCode: 404 });

        const resp = await handler(dummyApigwEvent);

        expect(resp.statusCode).toBe(404);
        expect(response.createResponse).toHaveBeenCalledWith(DriverErrorMessages.NOT_FOUND, 404);
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
        expect(response.createResponse).toHaveBeenCalledWith(DriverErrorMessages.BAD_REQUEST, 400);
      });
    });
    describe('500', () => {
      it('should return an internal server error', async () => {
        moqFindDriverPhotograph.setup(
          (x) => x(It.isAnyString(), It.isAnyString()),
        ).throws(new Error('err'));

        createResponseSpy.and.returnValue({ statusCode: 500 });

        const resp = await handler(dummyApigwEvent);

        expect(resp.statusCode).toBe(500);
        expect(response.createResponse).toHaveBeenCalledWith(DriverErrorMessages.INTERNAL_SERVER_ERROR, 500);
      });
    });
  });
});
