import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SolicitacaoService } from '../../../servicos/solicitacao.service';
import { AutenticacaoService } from '../../../servicos/autenticacao.service';
import { Solicitacao } from '../../../modelos/solicitacao.model';

@Component({
  selector: 'app-painel-arrendatario',
  templateUrl: './painel-arrendatario.component.html',
  styleUrls: ['./painel-arrendatario.component.css']
})
export class PainelArrendatarioComponent implements OnInit {
  carregando = true;
  
  // Estatísticas
  totalSolicitacoes = 0;
  solicitacoesPendentes = 0;
  solicitacoesAceites = 0;
  solicitacoesRecusadas = 0;
  
  // Dados
  ultimasSolicitacoes: Solicitacao[] = [];
  
  nomeUtilizador = '';

  constructor(
    private solicitacaoService: SolicitacaoService,
    public autenticacaoService: AutenticacaoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const utilizador = this.autenticacaoService.obterUtilizadorAtual();
    this.nomeUtilizador = utilizador?.nomeCompleto || 'Arrendatário';
    
    this.carregarDados();
  }

  carregarDados(): void {
    this.carregando = true;

    this.solicitacaoService.listarEnviadas().subscribe({
      next: (resposta) => {
        if (resposta.sucesso && resposta.dados) {
          const solicitacoes = resposta.dados;
          
          this.totalSolicitacoes = solicitacoes.length;
          this.solicitacoesPendentes = solicitacoes.filter(s => s.status === 'pendente').length;
          this.solicitacoesAceites = solicitacoes.filter(s => s.status === 'aceite').length;
          this.solicitacoesRecusadas = solicitacoes.filter(s => s.status === 'recusada').length;
          
          // Últimas 5 solicitações
          this.ultimasSolicitacoes = solicitacoes.slice(0, 5);
        }
        this.carregando = false;
      },
      error: (erro) => {
        console.error('Erro ao carregar solicitações:', erro);
        this.carregando = false;
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

  pesquisarImoveis(): void {
    this.router.navigate(['/imoveis']);
  }
}