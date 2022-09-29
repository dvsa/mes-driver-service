import jwtDecode from 'jwt-decode';
import { error } from '@dvsa/mes-microservice-common/application/utils/logger';

export function isJWTExpired(token: string): boolean {
  try {
    const decoded = jwtDecode(token) as { exp: number; [key: string]: any; };

    const currentTime: number = new Date().getTime() / 1000;

    return currentTime > decoded?.exp;
  } catch (err) {
    error('isJWTExpired error', err);
    return true;
  }
}
