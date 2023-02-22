import { APIGatewayProxyEvent } from 'aws-lambda';
import { bootstrapLogging, customMetric, error } from '@dvsa/mes-microservice-common/application/utils/logger';
import Response from '../../../common/application/api/Response';
import createResponse from '../../../common/application/utils/createResponse';
import { DriverErrorMessages } from '../../../common/application/driver/DriverErrMessages';
import { HttpStatus } from '../../../common/application/api/HttpStatus';
import { getMicrosoftTokenResponse } from '../../../common/application/auth/GetToken';
import { findStandardDriver } from '../../../common/application/driver/FindStandardDriverData';
import { isPayloadValid } from '../../../common/application/validation/ValidatePayload';

export async function handler(event: APIGatewayProxyEvent): Promise<Response> {
  try {
    bootstrapLogging('get-standard-driver-data', event);

    const payload = JSON.parse(event.body as string);
    if (!isPayloadValid(payload)) {
      return createResponse(DriverErrorMessages.INVALID, HttpStatus.BAD_REQUEST);
    }

    const tokenResponse = await getMicrosoftTokenResponse();

    const { drivingLicenceNumber, enquiryRefNumber } = payload;

    const driverPayload = await findStandardDriver(drivingLicenceNumber, enquiryRefNumber, tokenResponse.access_token);
    if (!driverPayload) {
      customMetric(
        'DriverStandardDataNotFound',
        'Driver standard data not found in DVLA system',
        { drivingLicenceNumber, enquiryRefNumber },
      );
      return createResponse(DriverErrorMessages.NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    customMetric('DriverStandardDataFound', 'Driver standard data found in DVLA system');
    return createResponse(driverPayload, HttpStatus.OK);
  } catch (err: unknown) {
    error('DriverStandardDataUnknownError', err);
    return createResponse(DriverErrorMessages.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
