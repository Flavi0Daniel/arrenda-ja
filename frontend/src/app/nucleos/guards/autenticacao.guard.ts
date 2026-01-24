import { CanActivateFn } from '@angular/router';

export const autenticacaoGuard: CanActivateFn = (route, state) => {
  return true;
};
