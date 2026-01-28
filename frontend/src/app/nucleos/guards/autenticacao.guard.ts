import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AutenticacaoService } from '../../servicos/autenticacao.service';

export const autenticacaoGuard: CanActivateFn = (route, state) => {
  const autenticacaoService = inject(AutenticacaoService);
  const router = inject(Router);

  if (autenticacaoService.estaAutenticado()) {
    return true;
  }

  // Redirecionar para login com URL de retorno
  router.navigate(['/entrar'], { queryParams: { returnUrl: state.url } });
  return false;
};