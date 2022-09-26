import createResponse from '../createResponse';
import Response from '../../api/Response';

describe('createResponse', () => {
  it('should create a response with 200 status code when no status code is specified', () => {
    const response: Response = createResponse({});
    expect(response.statusCode).toBe(200);
  });
});
