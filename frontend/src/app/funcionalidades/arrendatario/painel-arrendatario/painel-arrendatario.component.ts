import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SolicitacaoService } from '../../../servicos/solicitacao.service';
import { EstatisticaService } from '../../../servicos/estatistica.service';
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
    private estatisticaService: EstatisticaService,
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
    
    const utilizador = this.autenticacaoService.obterUtilizadorAtual();
    if (!utilizador) return;

    // Carregar estatísticas
    this.estatisticaService.obterEstatisticasArrendatario(utilizador.id).subscribe({
      next: (resposta) => {
        if (resposta.sucesso && resposta.dados) {
          const dados = resposta.dados;
          
          this.totalSolicitacoes = dados.solicitacoes.total;
          this.solicitacoesPendentes = dados.solicitacoes.pendentes;
          this.solicitacoesAceites = dados.solicitacoes.aceites;
          this.solicitacoesRecusadas = dados.solicitacoes.recusadas;
        }
      },
      error: (erro) => console.error('Erro ao carregar estatísticas:', erro)
    });

    // Carregar últimas solicitações
    this.solicitacaoService.listarEnviadas().subscribe({
      next: (resposta) => {
        if (resposta.sucesso && resposta.dados) {
          this.ultimasSolicitacoes = resposta.dados.slice(0, 5);
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