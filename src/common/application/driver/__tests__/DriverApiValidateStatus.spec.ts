import { driverApiValidateStatus } from '../DriverApiValidateStatus';

describe('driverApiValidateStatus', () => {
  describe('accepted status codes', () => {
    it('should return true for 200 OK', () => {
      expect(driverApiValidateStatus(200)).toBe(true);
    });

    it('should return true for 404 Not Found', () => {
      expect(driverApiValidateStatus(404)).toBe(true);
    });
  });

  describe('rejected status codes', () => {
    it('should return false for 400 Bad Request', () => {
      expect(driverApiValidateStatus(400)).toBe(false);
    });

    it('should return false for 401 Unauthorized', () => {
      expect(driverApiValidateStatus(401)).toBe(false);
    });

    it('should return false for 500 Internal Server Error', () => {
      expect(driverApiValidateStatus(500)).toBe(false);
    });

    it('should return false for 204 No Content', () => {
      expect(driverApiValidateStatus(204)).toBe(false);
    });
  });
});
