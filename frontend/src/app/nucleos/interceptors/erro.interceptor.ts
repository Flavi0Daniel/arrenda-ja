import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AutenticacaoService } from '../../servicos/autenticacao.service';

export const erroInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const autenticacaoService = inject(AutenticacaoService);

  return next(req).pipe(
    catchError((erro: HttpErrorResponse) => {
      let mensagemErro = 'Ocorreu um erro inesperado';

      if (erro.error instanceof ErrorEvent) {
        // Erro do lado do cliente
        mensagemErro = `Erro: ${erro.error.message}`;
      } else {
        // Erro do lado do servidor
        switch (erro.status) {
          case 401:
            mensagemErro = 'Não autorizado. Faça login novamente.';
            autenticacaoService.sair();
            router.navigate(['/entrar']);
            break;
          case 403:
            mensagemErro = 'Acesso negado.';
            break;
          case 404:
            mensagemErro = 'Recurso não encontrado.';
            break;
          case 500:
            mensagemErro = 'Erro interno do servidor.';
            break;
          default:
            mensagemErro = erro.error?.mensagem || mensagemErro;
        }
      }

      console.error('Erro HTTP:', mensagemErro);
      return throwError(() => new Error(mensagemErro));
    })
  );
};