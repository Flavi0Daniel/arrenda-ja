import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Condominio } from '../modelos/condominio.model';
import { RespostaAPI } from '../modelos/resposta-api.model';

@Injectable({
  providedIn: 'root'
})
export class CondominioService {
  private readonly API_URL = `${environment.apiUrl}/condominios`;

  constructor(private http: HttpClient) {}

  /**
   * Listar todos os condomínios
   */
  listarTodos(): Observable<RespostaAPI<Condominio[]>> {
    return this.http.get<RespostaAPI<Condominio[]>>(this.API_URL);
  }

  /**
   * Obter condomínio por ID
   */
  obterPorId(id: number): Observable<RespostaAPI<Condominio>> {
    return this.http.get<RespostaAPI<Condominio>>(`${this.API_URL}/${id}`);
  }

  /**
   * Obter lista de províncias
   */
  obterProvincias(): Observable<RespostaAPI<string[]>> {
    return this.http.get<RespostaAPI<string[]>>(`${this.API_URL}/provincias`);
  }

  /**
   * Obter municípios por província
   */
  obterMunicipios(provincia: string): Observable<RespostaAPI<string[]>> {
    return this.http.get<RespostaAPI<string[]>>(`${this.API_URL}/municipios/${provincia}`);
  }

  /**
   * Criar novo condomínio (admin)
   */
  criar(dados: Partial<Condominio>): Observable<RespostaAPI<Condominio>> {
    return this.http.post<RespostaAPI<Condominio>>(this.API_URL, dados);
  }
}