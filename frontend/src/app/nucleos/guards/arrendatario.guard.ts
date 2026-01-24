import { CanActivateFn } from '@angular/router';

export const arrendatarioGuard: CanActivateFn = (route, state) => {
  return true;
};
