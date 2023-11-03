import MockAdapter from 'axios-mock-adapter';
import { DriverPhotograph } from '@dvsa/mes-driver-schema';
import { AxiosError } from 'axios';
import { axiosInstance, findDriverPhotograph } from '../FindDriverPhotograph';

describe('findDriverPhotograph', () => {
  let mockClient: MockAdapter;
  const mockPayload = {
    photograph: {
      image: 'image str',
    },
  } as DriverPhotograph;

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
    mockClient.onPost('/base-url/image/photograph')
      .reply(200, { ...mockPayload });

    try {
      // ACT
      const resp = await findDriverPhotograph('DLN', 'eyj');
      // ASSERT
      expect(resp)
        .toEqual(mockPayload);
    } catch (err) {
      fail();
    }
  });
  it('should return null if not an error', async () => {
    // ARRANGE
    mockClient.onPost()
      .reply(204, {});

    try {
      // ACT
      const resp = await findDriverPhotograph('DLN', 'eyj');
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
      await findDriverPhotograph('DLN', 'eyj');
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
