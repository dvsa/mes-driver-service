import axios from 'axios';
import { DriverSignature } from '@dvsa/mes-driver-schema';
import { getDriverAPIKey, getDriverBaseEndpoint } from '../../framework/DriverEndpoint';
import { HttpStatus } from '../api/HttpStatus';

const axiosInstance = axios.create();

export async function findDriverSignature(
  drivingLicenceNumber: string,
  token: string,
): Promise<DriverSignature | null> {
  const URL: string = `${getDriverBaseEndpoint()}/image/signature`;

  const response = await axiosInstance.post(
    URL,
    JSON.stringify({ drivingLicenceNumber }),
    {
      headers: {
        Authorization: token,
        'x-api-key': getDriverAPIKey(),
        'Content-Type': 'application/json',
      },
    },
  );

  if (response.status === HttpStatus.OK) {
    return response.data;
  }
  return null;
}
