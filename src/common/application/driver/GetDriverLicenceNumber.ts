import { APIGatewayProxyEventPathParameters } from 'aws-lambda';
import { warn } from '@dvsa/mes-microservice-common/application/utils/logger';

export function getDrivingLicenceNumber(
  pathParams: APIGatewayProxyEventPathParameters | null,
): string | null {
  if (pathParams === null
    || typeof pathParams.drivingLicenceNumber !== 'string'
    || pathParams.drivingLicenceNumber.trim().length === 0
  ) {
    warn('No driving licence number path parameter found');
    return null;
  }
  return pathParams.drivingLicenceNumber;
}
