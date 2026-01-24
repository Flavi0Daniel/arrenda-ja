import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { 
  Utilizador, 
  RespostaAutenticacao, 
  DadosRegistro, 
  DadosLogin 
} from '../modelos/utilizador.model';

@Injectable({
  providedIn: 'root'
})
export class AutenticacaoService {
  private readonly API_URL = `${environment.apiUrl}/autenticacao`;
  private readonly TOKEN_KEY = 'token_arrendaja';
  private readonly UTILIZADOR_KEY = 'utilizador_arrendaja';

  private utilizadorAtualSubject = new BehaviorSubject<Utilizador | null>(this.obterUtilizadorArmazenado());
  public utilizadorAtual$ = this.utilizadorAtualSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  /**
   * Registar novo utilizador
   */
  registar(dados: DadosRegistro): Observable<RespostaAutenticacao> {
    return this.http.post<RespostaAutenticacao>(`${this.API_URL}/registar`, dados)
      .pipe(
        tap(resposta => {
          if (resposta.sucesso && resposta.dados) {
            this.armazenarSessao(resposta.dados.token, resposta.dados.utilizador);
          }
        })
      );
  }

  /**
   * Fazer login
   */
  entrar(dados: DadosLogin): Observable<RespostaAutenticacao> {
    return this.http.post<RespostaAutenticacao>(`${this.API_URL}/entrar`, dados)
      .pipe(
        tap(resposta => {
          if (resposta.sucesso && resposta.dados) {
            this.armazenarSessao(resposta.dados.token, resposta.dados.utilizador);
          }
        })
      );
  }

  /**
   * Fazer logout
   */
  sair(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.UTILIZADOR_KEY);
    this.utilizadorAtualSubject.next(null);
    this.router.navigate(['/']);
  }

  /**
   * Obter token armazenado
   */
  obterToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Verificar se está autenticado
   */
  estaAutenticado(): boolean {
    return !!this.obterToken();
  }

  /**
   * Obter utilizador atual
   */
  obterUtilizadorAtual(): Utilizador | null {
    return this.utilizadorAtualSubject.value;
  }

  /**
   * Verificar se é proprietário
   */
  eProprietario(): boolean {
    const utilizador = this.obterUtilizadorAtual();
    return utilizador?.tipoUtilizador === 'proprietario';
  }

  /**
   * Verificar se é arrendatário
   */
  eArrendatario(): boolean {
    const utilizador = this.obterUtilizadorAtual();
    return utilizador?.tipoUtilizador === 'arrendatario';
  }

  /**
   * Verificar se é administrador
   */
  eAdministrador(): boolean {
    const utilizador = this.obterUtilizadorAtual();
    return utilizador?.tipoUtilizador === 'administrador';
  }

  /**
   * Armazenar sessão
   */
  private armazenarSessao(token: string, utilizador: Utilizador): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.UTILIZADOR_KEY, JSON.stringify(utilizador));
    this.utilizadorAtualSubject.next(utilizador);
  }

  /**
   * Obter utilizador armazenado
   */
  private obterUtilizadorArmazenado(): Utilizador | null {
    const utilizadorJson = localStorage.getItem(this.UTILIZADOR_KEY);
    return utilizadorJson ? JSON.parse(utilizadorJson) : null;
  }
}