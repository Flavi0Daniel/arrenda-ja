import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MensagemService } from '../../../servicos/mensagem.service';
import { AutenticacaoService } from '../../../servicos/autenticacao.service';
import { Mensagem, EnviarMensagem } from '../../../modelos/mensagem.model';

@Component({
  selector: 'app-conversa',
  templateUrl: './conversa.component.html',
  styleUrls: ['./conversa.component.css']
})
export class ConversaComponent implements OnInit {

  @ViewChild('chatContainer') private chatContainer!: ElementRef;
 
  mensagens: Mensagem[] = [];
  outroUtilizadorId!: number;
  imovelId?: number;
  carregando = false;
  enviando = false;
  erro: string | null = null;
  
  novaMensagem = '';
  utilizadorAtualId!: number;
  nomeOutroUtilizador = '';
 
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private mensagemService: MensagemService,
    private autenticacaoService: AutenticacaoService
  ) {}
 
  ngOnInit(): void {
    // Obter ID do utilizador atual
    const utilizadorAtual = this.autenticacaoService.obterUtilizadorAtual();
    if (utilizadorAtual) {
      this.utilizadorAtualId = utilizadorAtual.id;
    }
 
    // Obter parâmetros da rota
    this.route.params.subscribe(params => {
      this.outroUtilizadorId = +params['id'];
      
      this.route.queryParams.subscribe(queryParams => {
        if (queryParams['imovelId']) {
          this.imovelId = +queryParams['imovelId'];
        }
        
        this.carregarConversa();
      });
    });
  }
 
  carregarConversa(): void {
    this.carregando = true;
    this.erro = null;
 
    this.mensagemService.obterConversa(this.outroUtilizadorId, this.imovelId).subscribe({
      next: (resposta) => {
        if (resposta.sucesso && resposta.dados) {
          this.mensagens = resposta.dados;
          
          // Obter nome do outro utilizador
          if (this.mensagens.length > 0) {
            const primeiraMensagem = this.mensagens[0];
            this.nomeOutroUtilizador = primeiraMensagem.remetenteId === this.utilizadorAtualId
              ? primeiraMensagem.destinatarioNome || 'Utilizador'
              : primeiraMensagem.remetenteNome || 'Utilizador';
          }
 
          setTimeout(() => this.rolarParaBaixo(), 100);
        }
        this.carregando = false;
      },
      error: (erro) => {
        this.erro = 'Erro ao carregar conversa';
        this.carregando = false;
        console.error('Erro:', erro);
      }
    });
  }
 
  enviarMensagem(): void {
    if (!this.novaMensagem.trim()) return;
 
    this.enviando = true;
 
    const dados: EnviarMensagem = {
      destinatarioId: this.outroUtilizadorId,
      conteudo: this.novaMensagem.trim()
    };
 
    if (this.imovelId) {
      dados.imovelId = this.imovelId;
    }
 
    this.mensagemService.enviar(dados).subscribe({
      next: (resposta) => {
        if (resposta.sucesso) {
          this.novaMensagem = '';
          this.carregarConversa();
        }
        this.enviando = false;
      },
      error: (erro) => {
        alert('Erro ao enviar mensagem');
        this.enviando = false;
        console.error('Erro:', erro);
      }
    });
  }
 
  voltarParaLista(): void {
    this.router.navigate(['/mensagens']);
  }
 
  rolarParaBaixo(): void {
    if (this.chatContainer) {
      const container = this.chatContainer.nativeElement;
      container.scrollTop = container.scrollHeight;
    }
  }
 
  eMinhaMensagem(mensagem: Mensagem): boolean {
    return mensagem.remetenteId === this.utilizadorAtualId;
  }
 
  obterTempoDecorrido(data: Date): string {
    return this.mensagemService.obterTempoDecorrido(data);
  }
 
  formatarHora(data: Date): string {
    return new Date(data).toLocaleTimeString('pt-AO', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

}
