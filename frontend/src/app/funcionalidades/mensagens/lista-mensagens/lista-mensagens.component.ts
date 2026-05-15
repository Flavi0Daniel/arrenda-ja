import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MensagemService } from '../../../servicos/mensagem.service';
import { Mensagem } from '../../../modelos/mensagem.model';

@Component({
  selector: 'app-lista-mensagens',
  templateUrl: './lista-mensagens.component.html',
  styleUrls: ['./lista-mensagens.component.css']
})
export class ListaMensagensComponent implements OnInit {

  mensagens: Mensagem[] = [];
  mensagensRecebidas: Mensagem[] = [];
  mensagensEnviadas: Mensagem[] = [];
  carregando = false;
  erro: string | null = null;
  
  abaAtiva: 'recebidas' | 'enviadas' = 'recebidas';
  apenasNaoLidas = false;
 
  constructor(
    private mensagemService: MensagemService,
    private router: Router
  ) {}
 
  ngOnInit(): void {
    this.carregarMensagens();
  }
 
  carregarMensagens(): void {
    this.carregando = true;
    this.erro = null;
 
    if (this.abaAtiva === 'recebidas') {
      this.mensagemService.listarRecebidas(this.apenasNaoLidas).subscribe({
        next: (resposta) => {
          if (resposta.sucesso && resposta.dados) {
            this.mensagensRecebidas = resposta.dados;
            this.mensagens = this.mensagensRecebidas;
          }
          this.carregando = false;
        },
        error: (erro) => {
          this.erro = 'Erro ao carregar mensagens recebidas';
          this.carregando = false;
          console.error('Erro:', erro);
        }
      });
    } else {
      this.mensagemService.listarEnviadas().subscribe({
        next: (resposta) => {
          if (resposta.sucesso && resposta.dados) {
            this.mensagensEnviadas = resposta.dados;
            this.mensagens = this.mensagensEnviadas;
          }
          this.carregando = false;
        },
        error: (erro) => {
          this.erro = 'Erro ao carregar mensagens enviadas';
          this.carregando = false;
          console.error('Erro:', erro);
        }
      });
    }
  }
 
  mudarAba(aba: 'recebidas' | 'enviadas'): void {
    this.abaAtiva = aba;
    this.apenasNaoLidas = false;
    this.carregarMensagens();
  }
 
  filtrarNaoLidas(): void {
    this.apenasNaoLidas = !this.apenasNaoLidas;
    if (this.abaAtiva === 'recebidas') {
      this.carregarMensagens();
    }
  }
 
  abrirConversa(mensagem: Mensagem): void {
    const outroUtilizadorId = this.abaAtiva === 'recebidas' 
      ? mensagem.remetenteId 
      : mensagem.destinatarioId;
    
    this.router.navigate(['/mensagens/conversa', outroUtilizadorId], {
      queryParams: mensagem.imovelId ? { imovelId: mensagem.imovelId } : {}
    });
  } 
 
  obterTempoDecorrido(data: Date): string {
    return this.mensagemService.obterTempoDecorrido(data);
  }
 
  obterIniciais(nome: string): string {
    if (!nome) return '?';
    const partes = nome.trim().split(' ');
    if (partes.length === 1) return partes[0].charAt(0).toUpperCase();
    return (partes[0].charAt(0) + partes[partes.length - 1].charAt(0)).toUpperCase();
  }

}
