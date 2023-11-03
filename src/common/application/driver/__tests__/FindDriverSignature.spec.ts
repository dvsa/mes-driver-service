import { describe } from 'node:test';
import MockAdapter from 'axios-mock-adapter';
import { DriverSignature } from '@dvsa/mes-driver-schema';
import { AxiosError } from 'axios';
import { axiosInstance, findDriverSignature } from '../FindDriverSignature';

describe('FindDriverSignature', () => {
  let mockClient: MockAdapter;
  const mockPayload = {
    signature: {
      image: 'image str',
    },
  } as DriverSignature;

  beforeAll(() => {
    mockClient = new MockAdapter(axiosInstance);
    process.env.BASE_DRIVER_URL = '/base-url';
  });

  afterEach(() => {
    mockClient.reset();
  });

  afterAll(() => {
    mockClient.restore();
  });

  it('should return payload when status is OK', async () => {
    // ARRANGE
    mockClient.onPost('/base-url/image/signature')
      .reply(200, { ...mockPayload });

    try {
      // ACT
      const resp = await findDriverSignature('DLN', 'eyj');
      // ASSERT
      expect(resp)
        .toEqual(mockPayload);
    } catch (err) {
      fail();
    }
  });
  it('should return null if not an error', async () => {
    // ARRANGE
    mockClient.onPost().reply(204, {});

    try {
      // ACT
      const resp = await findDriverSignature('DLN', 'eyj');
      // ASSERT
      expect(resp)
        .toEqual(null);
    } catch (err) {
      fail();
    }
  });
  it('should return null on error status', async () => {
    // ARRANGE
    mockClient.onPost()
      .reply(404, null);
    try {
      // ACT
      await findDriverSignature('DLN', 'eyj');
      fail();
    } catch (err) {
      // ASSERT
      expect((err as AxiosError).response?.status)
        .toEqual(404);
      expect((err as AxiosError).response?.data)
        .toEqual(null);
    }
  });
});
