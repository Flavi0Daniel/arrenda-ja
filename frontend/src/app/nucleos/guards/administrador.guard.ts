import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AutenticacaoService } from '../../servicos/autenticacao.service';

export const administradorGuard: CanActivateFn = (route, state) => {
  const autenticacaoService = inject(AutenticacaoService);
  const router = inject(Router);

  if (autenticacaoService.estaAutenticado() && autenticacaoService.eAdministrador()) {
    return true;
  }

  router.navigate(['/']);
  return false;
};