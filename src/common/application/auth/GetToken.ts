import axios, { AxiosResponse } from 'axios';
import { error } from '@dvsa/mes-microservice-common/application/utils/logger';
import { MicrosoftResponse } from '../../domain/token.interface';
import { isJWTExpired } from './CheckTokenExpiry';
import {
  getGrantType, getClientSecret, getClientID, getScope, getTokenURL,
} from '../../framework/Credentials';

const qs = require('qs');

const axiosClient = axios.create();
let tokenResponse: AxiosResponse<MicrosoftResponse>;

async function getNewTokenResponse(): Promise<AxiosResponse<MicrosoftResponse>> {
  return axiosClient.post(getTokenURL(), qs.stringify({
    grant_type: getGrantType(),
    client_id: getClientID(),
    client_secret: getClientSecret(),
    scope: getScope(),
  }));
}

export async function getMicrosoftTokenResponse(): Promise<MicrosoftResponse> {
  try {
    if (!tokenResponse || isJWTExpired(tokenResponse?.data.access_token)) {
      tokenResponse = await getNewTokenResponse();
    }
    return tokenResponse.data;
  } catch (err) {
    error(err as string);
    throw err;
  }
}
