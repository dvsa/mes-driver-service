import { APIGatewayProxyEvent } from 'aws-lambda';
import {
  bootstrapLogging, customMetric, error,
} from '@dvsa/mes-microservice-common/application/utils/logger';
import { createResponse } from '@dvsa/mes-microservice-common/application/api/create-response';
import { HttpStatus } from '@dvsa/mes-microservice-common/application/api/http-status';
import { DriverErrorMessages } from '../../../common/application/driver/DriverErrMessages';
import { getMicrosoftTokenResponse } from '../../../common/application/auth/GetToken';
import { findStandardDriver } from '../../../common/application/driver/FindStandardDriverData';
import { isPayloadValid } from '../../../common/application/validation/ValidatePayload';
import { Metric } from '../../../common/application/metric/metric';

export async function handler(event: APIGatewayProxyEvent) {
  try {
    bootstrapLogging('post-standard-driver-data', event);

    const payload = JSON.parse(event.body as string);
    if (!isPayloadValid(payload)) {
      error(DriverErrorMessages.INVALID, payload);
      return createResponse(DriverErrorMessages.INVALID, HttpStatus.BAD_REQUEST);
    }

    const tokenResponse = await getMicrosoftTokenResponse();

    const { drivingLicenceNumber, enquiryRefNumber } = payload;

    const driverPayload = await findStandardDriver(drivingLicenceNumber, enquiryRefNumber, tokenResponse.access_token);
    if (!driverPayload) {
      customMetric(
        Metric.DriverStandardDataNotFound,
        'Driver standard data not found in DVLA system',
        { drivingLicenceNumber, enquiryRefNumber },
      );
      return createResponse(DriverErrorMessages.NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    customMetric(Metric.DriverStandardDataFound, 'Driver standard data found in DVLA system');
    return createResponse(driverPayload, HttpStatus.OK);
  } catch (err: unknown) {
    error('DriverStandardDataUnknownError', err);
    return createResponse(DriverErrorMessages.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
