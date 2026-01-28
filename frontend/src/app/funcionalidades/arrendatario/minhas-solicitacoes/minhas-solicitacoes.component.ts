import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SolicitacaoService } from '../../../servicos/solicitacao.service';
import { Solicitacao } from '../../../modelos/solicitacao.model';

@Component({
  selector: 'app-minhas-solicitacoes',
  templateUrl: './minhas-solicitacoes.component.html',
  styleUrls: ['./minhas-solicitacoes.component.css']
})
export class MinhasSolicitacoesComponent implements OnInit {
  solicitacoes: Solicitacao[] = [];
  solicitacoesFiltradas: Solicitacao[] = [];
  carregando = false;
  erro: string | null = null;
  
  filtroStatus: string = 'todas';

  constructor(
    private solicitacaoService: SolicitacaoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarSolicitacoes();
  }

  carregarSolicitacoes(): void {
    this.carregando = true;
    this.erro = null;

    this.solicitacaoService.listarEnviadas().subscribe({
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

  cancelarSolicitacao(solicitacaoId: number): void {
    if (confirm('Tem certeza que deseja cancelar esta solicitação?')) {
      this.solicitacaoService.cancelar(solicitacaoId).subscribe({
        next: (resposta) => {
          if (resposta.sucesso) {
            alert('Solicitação cancelada com sucesso!');
            this.carregarSolicitacoes();
          }
        },
        error: (erro) => {
          alert('Erro ao cancelar solicitação');
          console.error('Erro:', erro);
        }
      });
    }
  }

  verImovel(imovelId: number): void {
    this.router.navigate(['/imoveis', imovelId]);
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