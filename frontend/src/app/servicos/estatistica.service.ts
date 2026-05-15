import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { RespostaAPI } from '../modelos/resposta-api.model';

export interface EstatisticasAdmin {
  imoveis: {
    total: number;
    disponiveis: number;
    arrendados: number;
    em_analise: number;
    inativos: number;
  };
  utilizadores: {
    total: number;
    proprietarios: number;
    arrendatarios: number;
    administradores: number;
  };
  solicitacoes: {
    total: number;
    pendentes: number;
    aceites: number;
    recusadas: number;
  };
  mensagens: {
    total: number;
    nao_lidas: number;
  };
}

export interface EstatisticasProprietario {
  imoveis: {
    total: number;
    disponiveis: number;
    arrendados: number;
    em_analise: number;
    inativos: number;
  };
  solicitacoes: {
    total: number;
    pendentes: number;
    aceites: number;
    recusadas: number;
  };
  visualizacoes: number;
}

export interface EstatisticasArrendatario {
  solicitacoes: {
    total: number;
    pendentes: number;
    aceites: number;
    recusadas: number;
    canceladas: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class EstatisticaService {
  private readonly API_URL = `${environment.apiUrl}/estatisticas`;

  constructor(private http: HttpClient) {}

  /**
   * Obter estatísticas do administrador
   */
  obterEstatisticasAdmin(): Observable<RespostaAPI<EstatisticasAdmin>> {
    return this.http.get<RespostaAPI<EstatisticasAdmin>>(`${this.API_URL}/administrador`);
  }

  /**
   * Obter estatísticas do proprietário
   */
  obterEstatisticasProprietario(proprietarioId: number): Observable<RespostaAPI<EstatisticasProprietario>> {
    return this.http.get<RespostaAPI<EstatisticasProprietario>>(`${this.API_URL}/proprietario/${proprietarioId}`);
  }

  /**
   * Obter estatísticas do arrendatário
   */
  obterEstatisticasArrendatario(arrendatarioId: number): Observable<RespostaAPI<EstatisticasArrendatario>> {
    return this.http.get<RespostaAPI<EstatisticasArrendatario>>(`${this.API_URL}/arrendatario/${arrendatarioId}`);
  }
}