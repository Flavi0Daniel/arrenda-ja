import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Imovel, FiltrosPesquisa } from '../modelos/imovel.model';
import { RespostaAPI } from '../modelos/resposta-api.model';

@Injectable({
  providedIn: 'root'
})
export class ImovelService {
  private readonly API_URL = `${environment.apiUrl}/imoveis`;

  constructor(private http: HttpClient) {}

  /**
   * Pesquisar imóveis com filtros
   */
  pesquisar(filtros: FiltrosPesquisa = {}): Observable<RespostaAPI<{ imoveis: Imovel[], pagina: number, itensPorPagina: number }>> {
    let params = new HttpParams();

    if (filtros.tipologia) params = params.set('tipologia', filtros.tipologia);
    if (filtros.precoMinimo) params = params.set('precoMinimo', filtros.precoMinimo.toString());
    if (filtros.precoMaximo) params = params.set('precoMaximo', filtros.precoMaximo.toString());
    if (filtros.provincia) params = params.set('provincia', filtros.provincia);
    if (filtros.municipio) params = params.set('municipio', filtros.municipio);
    if (filtros.bairro) params = params.set('bairro', filtros.bairro);
    if (filtros.temGaragem !== undefined) params = params.set('temGaragem', filtros.temGaragem.toString());
    if (filtros.temPiscina !== undefined) params = params.set('temPiscina', filtros.temPiscina.toString());
    if (filtros.estaMobilado !== undefined) params = params.set('estaMobilado', filtros.estaMobilado.toString());
    if (filtros.pagina) params = params.set('pagina', filtros.pagina.toString());
    if (filtros.itensPorPagina) params = params.set('itensPorPagina', filtros.itensPorPagina.toString());

    return this.http.get<RespostaAPI<any>>(`${this.API_URL}/pesquisar`, { params });
  }

  /**
   * Obter detalhes de um imóvel
   */
  obterPorId(id: number): Observable<RespostaAPI<Imovel>> {
    return this.http.get<RespostaAPI<Imovel>>(`${this.API_URL}/${id}`);
  }

  /**
   * Listar meus imóveis (proprietário)
   */
  listarMeus(): Observable<RespostaAPI<Imovel[]>> {
    return this.http.get<RespostaAPI<Imovel[]>>(`${this.API_URL}/meus`);
  }

  /**
   * Listar todos os imóveis (admin)
   */
  listarTodos(): Observable<RespostaAPI<Imovel[]>> {
    return this.http.get<RespostaAPI<Imovel[]>>(`${this.API_URL}/admin/todos`);
  }

  /**
   * Criar novo imóvel
   */
  criar(dadosImovel: Partial<Imovel>): Observable<RespostaAPI<Imovel>> {
    return this.http.post<RespostaAPI<Imovel>>(this.API_URL, dadosImovel);
  }

  /**
   * Atualizar imóvel
   */
  atualizar(id: number, dadosImovel: Partial<Imovel>): Observable<RespostaAPI<Imovel>> {
    return this.http.put<RespostaAPI<Imovel>>(`${this.API_URL}/${id}`, dadosImovel);
  }

  /**
   * Adicionar fotos ao imóvel
   */
  adicionarFotos(imovelId: number, fotos: File[]): Observable<RespostaAPI<any>> {
    const formData = new FormData();
    
    for (let i = 0; i < fotos.length; i++) {
      formData.append('fotos', fotos[i], fotos[i].name);
    }

    return this.http.post<RespostaAPI<any>>(`${this.API_URL}/${imovelId}/fotos`, formData);
  }

  /**
   * Marcar imóvel como arrendado
   */
  marcarComoArrendado(id: number): Observable<RespostaAPI<Imovel>> {
    return this.http.patch<RespostaAPI<Imovel>>(`${this.API_URL}/${id}/arrendado`, {});
  }

  /**
   * Alterar status do imóvel (admin)
   */
  alterarStatus(id: number, status: string): Observable<RespostaAPI<Imovel>> {
    return this.http.patch<RespostaAPI<Imovel>>(`${this.API_URL}/${id}/status`, { status });
  }

  /**
 * Alterar status (proprietário) - usa PUT em vez de PATCH
 */
  /**
 * Alterar status (proprietário) - endpoint específico
 */
alterarStatusProprietario(id: number, status: string): Observable<RespostaAPI<any>> {
  return this.http.patch<RespostaAPI<any>>(`${this.API_URL}/${id}/meu-status`, { status });
}

  /**
   * Remover foto do imóvel
   */
  removerFoto(imovelId: number, fotoId: number): Observable<RespostaAPI<any>> {
    return this.http.delete<RespostaAPI<any>>(`${this.API_URL}/${imovelId}/fotos/${fotoId}`);
  }

  /**
   * Obter URL completa da foto
   */
  obterUrlFoto(caminhoFoto: string): string {
    console.log('🔍 obterUrlFoto chamado com:', caminhoFoto);
    
    if (!caminhoFoto) {
      console.log('❌ Sem caminho, retornando imagem padrão');
      return 'https://placehold.co/400x300/e3e3e3/666?text=Sem+Imagem';
    }
    
    const url = `${environment.apiUrl.replace('/api', '')}/${caminhoFoto}`;
    console.log('✅ URL gerada:', url);
    
    return url;
  }
}