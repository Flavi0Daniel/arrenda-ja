import { CanActivateFn } from '@angular/router';

export const proprietarioGuard: CanActivateFn = (route, state) => {
  return true;
};
