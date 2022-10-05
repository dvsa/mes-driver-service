import { APIGatewayProxyEvent } from 'aws-lambda';
import { bootstrapLogging, error, warn } from '@dvsa/mes-microservice-common/application/utils/logger';
import { HttpStatus } from '../../../common/application/api/HttpStatus';
import createResponse from '../../../common/application/utils/createResponse';
import Response from '../../../common/application/api/Response';
import { getMicrosoftTokenResponse } from '../../../common/application/auth/GetToken';
import { findDriverPhotograph } from '../../../common/application/driver/FindDriverPhotograph';
import { getDrivingLicenceNumber } from '../../../common/application/driver/GetDriverLicenceNumber';
import { DriverErrorMessages } from '../../../common/application/driver/DriverErrMessages';

export async function handler(event: APIGatewayProxyEvent): Promise<Response> {
  try {
    bootstrapLogging('get-driver-photograph', event);

    const drivingLicenceNumber: string | null = getDrivingLicenceNumber(event.pathParameters);
    if (!drivingLicenceNumber) {
      return createResponse(DriverErrorMessages.BAD_REQUEST, HttpStatus.BAD_REQUEST);
    }

    const tokenResponse = await getMicrosoftTokenResponse();

    const driverPayload = await findDriverPhotograph(drivingLicenceNumber, tokenResponse.access_token);
    if (!driverPayload) {
      warn(`No driver photograph record detected for ${drivingLicenceNumber}`);
      return createResponse(DriverErrorMessages.NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return createResponse(driverPayload, HttpStatus.OK);
  } catch (err: unknown) {
    error(err as string);
    return createResponse(DriverErrorMessages.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
