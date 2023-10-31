import axios, { AxiosResponse } from 'axios';
import { stringify } from 'qs';
import { debug } from '@dvsa/mes-microservice-common/application/utils/logger';
import { MicrosoftResponse } from '../../domain/token.interface';
import { isJWTExpired } from './CheckTokenExpiry';
import {
  getClientID, getClientSecret, getGrantType, getScope, getTokenURL,
} from '../../framework/Credentials';

const axiosClient = axios.create();
let tokenResponse: AxiosResponse<MicrosoftResponse>;

async function getNewTokenResponse(): Promise<AxiosResponse<MicrosoftResponse>> {
  return axiosClient.post(getTokenURL(), stringify({
    grant_type: getGrantType(),
    client_id: getClientID(),
    client_secret: getClientSecret(),
    scope: getScope(),
  }));
}

export async function getMicrosoftTokenResponse(): Promise<MicrosoftResponse> {
  if (!tokenResponse || isJWTExpired(tokenResponse?.data.access_token)) {
    debug('Getting new token');
    tokenResponse = await getNewTokenResponse();
  } else {
    debug('Reusing cached token');
  }
  return tokenResponse.data;
}
