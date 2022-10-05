import { APIGatewayProxyEvent } from 'aws-lambda';
import { bootstrapLogging, error, warn } from '@dvsa/mes-microservice-common/application/utils/logger';
import Response from '../../../common/application/api/Response';
import createResponse from '../../../common/application/utils/createResponse';
import { DriverErrorMessages } from '../../../common/application/driver/DriverErrMessages';
import { HttpStatus } from '../../../common/application/api/HttpStatus';
import { getMicrosoftTokenResponse } from '../../../common/application/auth/GetToken';
import { getStandardDriverData } from '../../../common/application/driver/GetStandardDriverData';
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

    const driverPayload = await getStandardDriverData(
      drivingLicenceNumber,
      enquiryRefNumber,
      tokenResponse.access_token,
    );

    if (!driverPayload) {
      warn(`No standard driver data detected for ${JSON.stringify(payload)}`);
      return createResponse(DriverErrorMessages.NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return createResponse(driverPayload, HttpStatus.OK);
  } catch (err: unknown) {
    error(err as string);
    return createResponse(DriverErrorMessages.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
