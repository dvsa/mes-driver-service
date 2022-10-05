import axios from 'axios';
import { error } from '@dvsa/mes-microservice-common/application/utils/logger';
import { getDriverAPIKey, getDriverBaseEndpoint } from '../../framework/DriverEndpoint';
import { HttpStatus } from '../api/HttpStatus';
import { DriverStandard } from '../../domain/driver-standard.interface';

const axiosInstance = axios.create();

export async function getStandardDriverData(
  drivingLicenceNumber: string,
  enquiryRefNumber: string,
  token: string,
): Promise<DriverStandard | null> {
  try {
    const URL: string = `${getDriverBaseEndpoint()}/driver/standard`;

    const response = await axiosInstance.post(
      URL,
      JSON.stringify({ drivingLicenceNumber, enquiryRefNumber }),
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
