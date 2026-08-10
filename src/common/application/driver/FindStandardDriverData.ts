import axios from 'axios';
import { DriverStandard } from '@dvsa/mes-driver-schema';
import { HttpStatus } from '@dvsa/mes-microservice-common/application/api/http-status';
import { getDriverBaseEndpoint } from '../../framework/DriverEndpoint';
import { TokenService } from '../auth/GetToken';
import { driverApiValidateStatus } from './DriverApiValidateStatus';

export const axiosInstance = axios.create();

export async function findStandardDriver(
  drivingLicenceNumber: string,
  enquiryRefNumber: string,
): Promise<DriverStandard | null> {
  const URL: string = `${getDriverBaseEndpoint()}/driver/standard`;

  const tokenService = new TokenService();
  await tokenService.getSecrets();
  const tokenResponse = await tokenService.getMicrosoftTokenResponse();

  const response = await axiosInstance.post(
    URL,
    JSON.stringify({ drivingLicenceNumber, enquiryRefNumber }),
    {
      headers: {
        Authorization: tokenResponse.access_token,
        'x-api-key': tokenService.apiKey,
        'Content-Type': 'application/json',
      },
      validateStatus: driverApiValidateStatus,
    },
  );

  if (response.status === HttpStatus.OK) {
    return response.data;
  }
  return null;
}
