import { APIGatewayProxyEvent } from 'aws-lambda';
import { bootstrapLogging, customMetric, error } from '@dvsa/mes-microservice-common/application/utils/logger';
import Response from '../../../common/application/api/Response';
import createResponse from '../../../common/application/utils/createResponse';
import { DriverErrorMessages } from '../../../common/application/driver/DriverErrMessages';
import { HttpStatus } from '../../../common/application/api/HttpStatus';
import { getDrivingLicenceNumber } from '../../../common/application/driver/GetDriverLicenceNumber';
import { getMicrosoftTokenResponse } from '../../../common/application/auth/GetToken';
import { findDriverSignature } from '../../../common/application/driver/FindDriverSignature';
import { Metric } from '../../../common/application/metric/metric';

export async function handler(event: APIGatewayProxyEvent): Promise<Response> {
  try {
    bootstrapLogging('get-driver-signature', event);

    const drivingLicenceNumber = getDrivingLicenceNumber(event.pathParameters);
    if (!drivingLicenceNumber) {
      error(DriverErrorMessages.BAD_REQUEST);
      return createResponse(DriverErrorMessages.BAD_REQUEST, HttpStatus.BAD_REQUEST);
    }

    const tokenResponse = await getMicrosoftTokenResponse();

    const driverPayload = await findDriverSignature(drivingLicenceNumber, tokenResponse.access_token);
    if (!driverPayload) {
      customMetric(Metric.DriverSignatureNotFound, 'Driver signature not found in DVLA system', drivingLicenceNumber);
      return createResponse(DriverErrorMessages.NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    customMetric(Metric.DriverSignatureFound, 'Driver signature found in DVLA system');
    return createResponse(driverPayload, HttpStatus.OK);
  } catch (err: unknown) {
    error('DriverSignatureUnknownError', err);
    return createResponse(DriverErrorMessages.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
