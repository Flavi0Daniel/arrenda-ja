import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Mensagem, EnviarMensagem } from '../modelos/mensagem.model';
import { RespostaAPI } from '../modelos/resposta-api.model';

@Injectable({
  providedIn: 'root'
})
export class MensagemService {
  private readonly API_URL = `${environment.apiUrl}/mensagens`;
  private mensagensNaoLidasSubject = new BehaviorSubject<number>(0);
  public mensagensNaoLidas$ = this.mensagensNaoLidasSubject.asObservable();

  constructor(private http: HttpClient) {
    this.atualizarContadorNaoLidas();
  }

  /**
   * Enviar mensagem
   */
  enviar(dados: EnviarMensagem): Observable<RespostaAPI<Mensagem>> {
    return this.http.post<RespostaAPI<Mensagem>>(this.API_URL, dados);
  }

  /**
   * Listar mensagens recebidas
   */
  listarRecebidas(apenasNaoLidas: boolean = false): Observable<RespostaAPI<Mensagem[]>> {
    let params = new HttpParams();
    if (apenasNaoLidas) {
      params = params.set('naoLidas', 'true');
    }

    return this.http.get<RespostaAPI<Mensagem[]>>(`${this.API_URL}/recebidas`, { params });
  }

  /**
   * Listar mensagens enviadas
   */
  listarEnviadas(): Observable<RespostaAPI<Mensagem[]>> {
    return this.http.get<RespostaAPI<Mensagem[]>>(`${this.API_URL}/enviadas`);
  }

  /**
   * Ler mensagem específica
   */
  ler(id: number): Observable<RespostaAPI<Mensagem>> {
    return this.http.get<RespostaAPI<Mensagem>>(`${this.API_URL}/${id}`)
      .pipe(
        tap(() => this.atualizarContadorNaoLidas())
      );
  }

  /**
   * Obter conversa com outro utilizador
   */
  obterConversa(utilizadorId: number, imovelId?: number): Observable<RespostaAPI<Mensagem[]>> {
    let params = new HttpParams();
    if (imovelId) {
      params = params.set('imovelId', imovelId.toString());
    }

    return this.http.get<RespostaAPI<Mensagem[]>>(
      `${this.API_URL}/conversa/${utilizadorId}`,
      { params }
    );
  }

  /**
   * Contar mensagens não lidas
   */
  contarNaoLidas(): Observable<RespostaAPI<{ total: number }>> {
    return this.http.get<RespostaAPI<{ total: number }>>(`${this.API_URL}/nao-lidas/contar`)
      .pipe(
        tap(resposta => {
          if (resposta.sucesso && resposta.dados) {
            this.mensagensNaoLidasSubject.next(resposta.dados.total);
          }
        })
      );
  }

  /**
   * Atualizar contador de mensagens não lidas
   */
  atualizarContadorNaoLidas(): void {
    this.contarNaoLidas().subscribe();
  }

  /**
   * Formatar tempo decorrido
   */
  obterTempoDecorrido(data: Date): string {
    const agora = new Date();
    const envio = new Date(data);
    const diferencaMs = agora.getTime() - envio.getTime();
    
    const minutos = Math.floor(diferencaMs / 60000);
    const horas = Math.floor(diferencaMs / 3600000);
    const dias = Math.floor(diferencaMs / 86400000);
    
    if (minutos < 1) return 'Agora mesmo';
    if (minutos < 60) return `Há ${minutos} minuto${minutos > 1 ? 's' : ''}`;
    if (horas < 24) return `Há ${horas} hora${horas > 1 ? 's' : ''}`;
    if (dias < 7) return `Há ${dias} dia${dias > 1 ? 's' : ''}`;
    
    return envio.toLocaleDateString('pt-AO');
  }
}