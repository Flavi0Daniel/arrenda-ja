import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { AutenticacaoService } from '../../servicos/autenticacao.service';

export const autenticacaoInterceptor: HttpInterceptorFn = (req, next) => {
  const autenticacaoService = inject(AutenticacaoService);
  const token = autenticacaoService.obterToken();

  if (token) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedRequest);
  }

  return next(req);
};