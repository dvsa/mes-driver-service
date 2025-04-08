import axios, { AxiosResponse } from 'axios';
import { stringify } from 'qs';
import { debug, error } from '@dvsa/mes-microservice-common/application/utils/logger';
import { jwtDecode } from 'jwt-decode';
import { MicrosoftResponse } from '../../domain/token.interface';
import { getEnvSecrets } from '../../domain/config-helpers';

let tokenResponse: AxiosResponse<MicrosoftResponse>;

export class TokenService {
  private tokenURL: string = process.env.TOKEN_ENDPOINT || '';

  private grantType: string = process.env.GRANT_TYPE || '';

  private scope: string = process.env.SCOPE || '';

  public clientId = '';

  public clientSecret = '';

  public apiKey = '';

  /**
   * Confirm if token is expired and get new token if needed
   */
  async getMicrosoftTokenResponse(): Promise<MicrosoftResponse> {
    if (!tokenResponse || this.isJWTExpired(tokenResponse?.data.access_token)) {
      debug('Requesting a new token');
      tokenResponse = await this.getNewTokenResponse();
    } else {
      debug('Reusing cached token');
    }
    return tokenResponse.data;
  }

  /**
   * Perform a check on JWT token to confirm if it is expired
   * @param token
   */
  isJWTExpired(token: string): boolean {
    try {
      const decoded = jwtDecode(token) as { exp: number };
      const currentTime: number = new Date().getTime() / 1000;
      return currentTime > decoded?.exp;
    } catch (err) {
      error(`isJWTExpired error: ${err}`);
      return true;
    }
  }

  /**
   * Request a new token from Microsoft
   */
  async getNewTokenResponse(): Promise<AxiosResponse<MicrosoftResponse>> {
    return axios.post(
      this.tokenURL,
      stringify({
        grant_type: this.grantType,
        client_id: this.clientId,
        client_secret: this.clientSecret,
        scope: this.scope,
      }),
    );
  }

  /**
   * Get secrets from AWS Secrets Manager
   */
  async getSecrets() {
    const secrets = process.env.LOCAL_DEVELOPMENT === 'true' ? process.env
      : await getEnvSecrets(process.env.SECRET_NAME || '');
    this.clientId = secrets.CLIENT_ID || '';
    this.clientSecret = secrets.CLIENT_SECRET || '';
    this.apiKey = secrets.API_KEY || '';
  }
}
