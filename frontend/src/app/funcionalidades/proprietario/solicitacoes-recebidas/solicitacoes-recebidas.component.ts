import { Component, OnInit } from '@angular/core';
import { SolicitacaoService } from '../../../servicos/solicitacao.service';
import { Solicitacao } from '../../../modelos/solicitacao.model';

@Component({
  selector: 'app-solicitacoes-recebidas',
  templateUrl: './solicitacoes-recebidas.component.html',
  styleUrls: ['./solicitacoes-recebidas.component.css']
})
export class SolicitacoesRecebidasComponent implements OnInit {
  solicitacoes: Solicitacao[] = [];
  solicitacoesFiltradas: Solicitacao[] = [];
  carregando = false;
  erro: string | null = null;
  
  filtroStatus: string = 'pendente';
  
  // Modal de resposta
  mostrarModal = false;
  solicitacaoSelecionada: Solicitacao | null = null;
  observacoes = '';
  enviandoResposta = false;

  constructor(private solicitacaoService: SolicitacaoService) {}

  ngOnInit(): void {
    this.carregarSolicitacoes();
  }

  carregarSolicitacoes(): void {
    this.carregando = true;
    this.erro = null;

    this.solicitacaoService.listarRecebidas().subscribe({
      next: (resposta) => {
        if (resposta.sucesso && resposta.dados) {
          this.solicitacoes = resposta.dados;
          this.aplicarFiltro();
        }
        this.carregando = false;
      },
      error: (erro) => {
        this.erro = 'Erro ao carregar solicitações';
        this.carregando = false;
        console.error('Erro:', erro);
      }
    });
  }

  aplicarFiltro(): void {
    if (this.filtroStatus === 'todas') {
      this.solicitacoesFiltradas = this.solicitacoes;
    } else {
      this.solicitacoesFiltradas = this.solicitacoes.filter(s => s.status === this.filtroStatus);
    }
  }

  abrirModal(solicitacao: Solicitacao, aceitar: boolean): void {
    this.solicitacaoSelecionada = solicitacao;
    this.observacoes = '';
    this.mostrarModal = true;
  }

  fecharModal(): void {
    this.mostrarModal = false;
    this.solicitacaoSelecionada = null;
    this.observacoes = '';
  }

  responderSolicitacao(aceitar: boolean): void {
    if (!this.solicitacaoSelecionada) return;

    this.enviandoResposta = true;

    this.solicitacaoService.responder(
      this.solicitacaoSelecionada.id,
      { aceitar, observacoes: this.observacoes }
    ).subscribe({
      next: (resposta) => {
        if (resposta.sucesso) {
          alert(aceitar ? 'Solicitação aceite!' : 'Solicitação recusada');
          this.fecharModal();
          this.carregarSolicitacoes();
        }
        this.enviandoResposta = false;
      },
      error: (erro) => {
        alert('Erro ao responder solicitação');
        this.enviandoResposta = false;
      }
    });
  }

  formatarPreco(preco: number): string {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA'
    }).format(preco);
  }

  obterCorStatus(status: string): string {
    return this.solicitacaoService.obterCorStatus(status);
  }

  obterTextoStatus(status: string): string {
    return this.solicitacaoService.obterTextoStatus(status);
  }
}