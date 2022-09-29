import axios from 'axios';
import { error } from '@dvsa/mes-microservice-common/application/utils/logger';
import { HttpStatus } from '../api/HttpStatus';
import { DriverPhotograph } from '../../domain/driver-photograph.interface';
import { getDriverBaseEndpoint, getDriverAPIKey } from '../../framework/DriverEndpoint';

const axiosInstance = axios.create();

export async function findDriverPhotograph(
  drivingLicenceNumber: string,
  token: string,
): Promise<DriverPhotograph | null> {
  try {
    const URL: string = `${getDriverBaseEndpoint()}/image/photograph`;

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
