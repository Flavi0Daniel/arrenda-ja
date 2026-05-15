import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Utilizador } from '../modelos/utilizador.model';
import { RespostaAPI } from '../modelos/resposta-api.model';

export interface AtualizarPerfil {
  nomeCompleto?: string;
  telefone?: string;
}

export interface AlterarSenha {
  senhaAtual: string;
  novaSenha: string;
}

@Injectable({
  providedIn: 'root'
})
export class UtilizadorService {
  private readonly API_URL = `${environment.apiUrl}/utilizadores`;

  constructor(private http: HttpClient) {}

  /**
   * Obter perfil do utilizador autenticado
   */
  obterPerfil(): Observable<RespostaAPI<Utilizador>> {
    return this.http.get<RespostaAPI<Utilizador>>(`${this.API_URL}/perfil`);
  }

  /**
   * Atualizar perfil
   */
  atualizarPerfil(dados: AtualizarPerfil): Observable<RespostaAPI<Utilizador>> {
    return this.http.put<RespostaAPI<Utilizador>>(`${this.API_URL}/perfil`, dados);
  }

  /**
   * Alterar senha
   */
  alterarSenha(dados: AlterarSenha): Observable<RespostaAPI<any>> {
    return this.http.patch<RespostaAPI<any>>(`${this.API_URL}/alterar-senha`, dados);
  }

  /**
   * Upload de foto de perfil
   */
  uploadFotoPerfil(foto: File): Observable<RespostaAPI<{ caminhoFoto: string }>> {
    const formData = new FormData();
    formData.append('fotoPerfil', foto, foto.name);

    return this.http.post<RespostaAPI<{ caminhoFoto: string }>>(
      `${this.API_URL}/perfil/foto`,
      formData
    );
  }

  /**
   * Obter URL completa da foto de perfil
   */
  obterUrlFotoPerfil(caminhoFoto?: string): string {
    if (!caminhoFoto) return 'assets/images/avatar-default.png';
    return `${environment.apiUrl.replace('/api', '')}/${caminhoFoto}`;
  }

  /**
   * Obter iniciais do nome
   */
  obterIniciais(nome: string): string {
    if (!nome) return '?';
    const partes = nome.trim().split(' ');
    if (partes.length === 1) return partes[0].charAt(0).toUpperCase();
    return (partes[0].charAt(0) + partes[partes.length - 1].charAt(0)).toUpperCase();
  }

  /**
   * Listar todos os utilizadores (admin)
   */
  listarTodos(): Observable<RespostaAPI<{ utilizadores: Utilizador[] }>> {
    return this.http.get<RespostaAPI<{ utilizadores: Utilizador[] }>>(`${this.API_URL}`);
  }

  /**
   * Criar novo utilizador (admin)
   */
  criar(dados: any): Observable<RespostaAPI<Utilizador>> {
    return this.http.post<RespostaAPI<Utilizador>>(`${this.API_URL}`, dados);
  }

  /**
   * Editar utilizador (admin)
   */
  editar(id: number, dados: any): Observable<RespostaAPI<Utilizador>> {
    return this.http.put<RespostaAPI<Utilizador>>(`${this.API_URL}/${id}`, dados);
  }

  /**
   * Desativar utilizador (admin)
   */
  desativar(id: number): Observable<RespostaAPI<any>> {
    return this.http.delete<RespostaAPI<any>>(`${this.API_URL}/${id}`);
  }

  /**
   * Reativar utilizador (admin)
   */
  reativar(id: number): Observable<RespostaAPI<any>> {
    return this.http.patch<RespostaAPI<any>>(`${this.API_URL}/${id}/reativar`, {});
  }


}