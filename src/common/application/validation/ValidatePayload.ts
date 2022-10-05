import * as Joi from 'joi';
import { error } from '@dvsa/mes-microservice-common/application/utils/logger';

export const isPayloadValid = (payload: {drivingLicenceNumber: string; enquiryRefNumber: string;}): boolean => {
  const schema = Joi.object({
    drivingLicenceNumber: Joi.string().required(),
    enquiryRefNumber: Joi.string().required(),
  });

  const joiError = schema.validate(payload).error;

  if (joiError) {
    error('Validation failed', joiError);
    return false;
  }
  return true;
};
