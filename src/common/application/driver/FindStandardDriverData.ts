import axios from 'axios';
import { DriverStandard } from '@dvsa/mes-driver-schema';
import { HttpStatus } from '@dvsa/mes-microservice-common/application/api/http-status';
import { getDriverAPIKey, getDriverBaseEndpoint } from '../../framework/DriverEndpoint';

const axiosInstance = axios.create();

export async function findStandardDriver(
  drivingLicenceNumber: string,
  enquiryRefNumber: string,
  token: string,
): Promise<DriverStandard | null> {
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
}
