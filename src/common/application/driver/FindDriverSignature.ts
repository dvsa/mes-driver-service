import axios from 'axios';
import { error } from '@dvsa/mes-microservice-common/application/utils/logger';
import { DriverPhotograph } from '../../domain/driver-photograph.interface';
import { getDriverAPIKey, getDriverBaseEndpoint } from '../../framework/DriverEndpoint';
import { HttpStatus } from '../api/HttpStatus';

const axiosInstance = axios.create();

export async function findDriverSignature(
  drivingLicenceNumber: string,
  token: string,
): Promise<DriverPhotograph | null> {
  try {
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
  } catch (err: unknown) {
    error(err as string);
    throw err;
  }
}
