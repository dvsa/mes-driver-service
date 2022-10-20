import axios, { AxiosResponse } from 'axios';
import { MicrosoftResponse } from '../../domain/token.interface';
import { isJWTExpired } from './CheckTokenExpiry';
import {
  getClientID, getClientSecret, getGrantType, getScope, getTokenURL,
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
  if (!tokenResponse || isJWTExpired(tokenResponse?.data.access_token)) {
    tokenResponse = await getNewTokenResponse();
  }
  return tokenResponse.data;
}
