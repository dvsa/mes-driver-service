import axios from 'axios';
import { DriverSignature } from '@dvsa/mes-driver-schema';
import { HttpStatus } from '@dvsa/mes-microservice-common/application/api/http-status';
import { getDriverBaseEndpoint } from '../../framework/DriverEndpoint';
import { TokenService } from '../auth/GetToken';

export const axiosInstance = axios.create();

export async function findDriverSignature(
  drivingLicenceNumber: string,
): Promise<DriverSignature | null> {
  const URL: string = `${getDriverBaseEndpoint()}/image/signature`;

  const tokenService = new TokenService();
  await tokenService.getSecrets();
  const tokenResponse = await tokenService.getMicrosoftTokenResponse();

  const response = await axiosInstance.post(
    URL,
    JSON.stringify({ drivingLicenceNumber }),
    {
      headers: {
        Authorization: tokenResponse.access_token,
        'x-api-key': tokenService.apiKey,
        'Content-Type': 'application/json',
      },
    },
  );

  if (response.status === HttpStatus.OK) {
    return response.data;
  }
  return null;
}
