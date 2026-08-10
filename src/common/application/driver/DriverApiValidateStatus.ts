import { HttpStatus } from '@dvsa/mes-microservice-common/application/api/http-status';

/**
 * Axios validateStatus function for driver API calls.
 * Treats 200 (OK) and 404 (Not Found) as non-error responses,
 * since the upstream driver service returns 404 when no data is found.
 */
export const driverApiValidateStatus = (status: number): boolean => {
  const acceptedStatuses = [HttpStatus.OK, HttpStatus.NOT_FOUND];
  return acceptedStatuses.includes(status);
};
