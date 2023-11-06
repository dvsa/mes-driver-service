import MockAdapter from 'axios-mock-adapter';
import { DriverStandard } from '@dvsa/mes-driver-schema';
import { AxiosError } from 'axios';
import { axiosInstance, findStandardDriver } from '../FindStandardDriverData';

describe('FindStandardDriver', () => {
  let mockClient: MockAdapter;
  const mockPayload = {
    driver: {
      firstNames: 'Jeremy',
      lastName: 'Craig',
    },
  } as DriverStandard;

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
    mockClient.onPost('/base-url/driver/standard')
      .reply(200, { ...mockPayload });

    try {
      // ACT
      const resp = await findStandardDriver('DLN', 'ref', 'eyj');
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
      const resp = await findStandardDriver('DLN', 'ref', 'eyj');
      // ASSERT
      expect(resp).toEqual(null);
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
      await findStandardDriver('DLN', 'ref', 'eyj');
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
