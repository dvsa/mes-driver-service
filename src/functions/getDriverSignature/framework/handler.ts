import { APIGatewayProxyEvent } from 'aws-lambda';
import {
  bootstrapLogging, customMetric, error,
} from '@dvsa/mes-microservice-common/application/utils/logger';
import { createResponse } from '@dvsa/mes-microservice-common/application/api/create-response';
import { HttpStatus } from '@dvsa/mes-microservice-common/application/api/http-status';
import { getPathParam } from '@dvsa/mes-microservice-common/framework/validation/event-validation';
import { DriverErrorMessages } from '../../../common/application/driver/DriverErrMessages';
import { getMicrosoftTokenResponse } from '../../../common/application/auth/GetToken';
import { findDriverSignature } from '../../../common/application/driver/FindDriverSignature';
import { Metric } from '../../../common/application/metric/metric';

export async function handler(event: APIGatewayProxyEvent) {
  try {
    bootstrapLogging('get-driver-signature', event);

    const drivingLicenceNumber = getPathParam(event.pathParameters, 'drivingLicenceNumber');
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
