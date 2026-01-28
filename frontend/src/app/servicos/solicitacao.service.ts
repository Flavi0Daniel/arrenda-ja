import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Solicitacao, CriarSolicitacao, ResponderSolicitacao } from '../modelos/solicitacao.model';
import { RespostaAPI } from '../modelos/resposta-api.model';

@Injectable({
  providedIn: 'root'
})
export class SolicitacaoService {
  private readonly API_URL = `${environment.apiUrl}/solicitacoes`;

  constructor(private http: HttpClient) {}

  /**
   * Criar nova solicitação de arrendamento
   */
  criar(dados: CriarSolicitacao): Observable<RespostaAPI<Solicitacao>> {
    return this.http.post<RespostaAPI<Solicitacao>>(this.API_URL, dados);
  }

  /**
   * Listar solicitações recebidas (proprietário)
   */
  listarRecebidas(status?: string): Observable<RespostaAPI<Solicitacao[]>> {
    const url = status 
      ? `${this.API_URL}/recebidas?status=${status}`
      : `${this.API_URL}/recebidas`;
    
    return this.http.get<RespostaAPI<Solicitacao[]>>(url);
  }

  /**
   * Listar solicitações enviadas (arrendatário)
   */
  listarEnviadas(): Observable<RespostaAPI<Solicitacao[]>> {
    return this.http.get<RespostaAPI<Solicitacao[]>>(`${this.API_URL}/enviadas`);
  }

  /**
   * Responder a uma solicitação (aceitar/recusar)
   */
  responder(id: number, dados: ResponderSolicitacao): Observable<RespostaAPI<Solicitacao>> {
    return this.http.patch<RespostaAPI<Solicitacao>>(`${this.API_URL}/${id}/responder`, dados);
  }

  /**
   * Cancelar solicitação (arrendatário)
   */
  cancelar(id: number): Observable<RespostaAPI<Solicitacao>> {
    return this.http.patch<RespostaAPI<Solicitacao>>(`${this.API_URL}/${id}/cancelar`, {});
  }

  /**
   * Contar solicitações pendentes
   */
  contarPendentes(): Observable<RespostaAPI<{ total: number }>> {
    return this.http.get<RespostaAPI<{ total: number }>>(`${this.API_URL}/pendentes/contar`);
  }

  /**
   * Obter cor do badge baseado no status
   */
  obterCorStatus(status: string): string {
    const cores: { [key: string]: string } = {
      'pendente': 'warning',
      'aceite': 'success',
      'recusada': 'danger',
      'cancelada': 'secondary'
    };
    return cores[status] || 'secondary';
  }

  /**
   * Obter texto do status em português
   */
  obterTextoStatus(status: string): string {
    const textos: { [key: string]: string } = {
      'pendente': 'Pendente',
      'aceite': 'Aceite',
      'recusada': 'Recusada',
      'cancelada': 'Cancelada'
    };
    return textos[status] || status;
  }
}