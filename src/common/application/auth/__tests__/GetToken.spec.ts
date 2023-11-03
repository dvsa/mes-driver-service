import MockAdapter from 'axios-mock-adapter';
import * as CheckToken from '../CheckTokenExpiry';
import { axiosClient, getMicrosoftTokenResponse } from '../GetToken';
import { MicrosoftResponse } from '../../../domain/token.interface';

describe('Token Service', () => {
  let mockClient: MockAdapter;
  const mockMicrosoftResponse = {
    token_type: 'token',
    access_token: 'access',
  } as MicrosoftResponse;

  beforeAll(() => {
    mockClient = new MockAdapter(axiosClient);

    process.env.TOKEN_ENDPOINT = '/endpoint';
  });

  afterEach(() => {
    mockClient.reset();
  });

  afterAll(() => {
    mockClient.restore();
  });

  describe('getMicrosoftTokenResponse', () => {
    it('should get Microsoft token response', async () => {
      mockClient.onPost('/endpoint').reply(200, { ...mockMicrosoftResponse });

      // Get fresh response when tokenResponse is undefined
      const resp1 = await getMicrosoftTokenResponse();
      expect(resp1).toEqual(mockMicrosoftResponse);

      // Get fresh response when tokenResponse is expired
      const resp2 = await getMicrosoftTokenResponse();
      expect(resp2).toEqual(mockMicrosoftResponse);

      // Reuse response when not expired
      spyOn(CheckToken, 'isJWTExpired').and.returnValue(false);
      const resp3 = await getMicrosoftTokenResponse();
      expect(resp3).toEqual(mockMicrosoftResponse);
    });
  });
});
