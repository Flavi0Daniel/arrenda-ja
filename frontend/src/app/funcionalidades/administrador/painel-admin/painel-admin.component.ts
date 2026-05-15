import { Component, OnInit } from '@angular/core';
import { EstatisticaService } from '../../../servicos/estatistica.service';
import { AutenticacaoService } from '../../../servicos/autenticacao.service';

@Component({
  selector: 'app-painel-admin',
  templateUrl: './painel-admin.component.html',
  styleUrls: ['./painel-admin.component.css']
})
export class PainelAdminComponent implements OnInit {
  carregando = true;
  erro: string | null = null;
  
  // Estatísticas
  totalImoveis = 0;
  imoveisEmAnalise = 0;
  imoveisDisponiveis = 0;
  imoveisArrendados = 0;
  
  totalUtilizadores = 0;
  totalProprietarios = 0;
  totalArrendatarios = 0;
  
  totalSolicitacoes = 0;
  solicitacoesPendentes = 0;
  
  nomeUtilizador = '';

  constructor(
    private estatisticaService: EstatisticaService,
    public autenticacaoService: AutenticacaoService
  ) {}

  ngOnInit(): void {
    const utilizador = this.autenticacaoService.obterUtilizadorAtual();
    this.nomeUtilizador = utilizador?.nomeCompleto || 'Administrador';
    
    this.carregarEstatisticas();
  }

  carregarEstatisticas(): void {
    this.carregando = true;
    this.erro = null;

    this.estatisticaService.obterEstatisticasAdmin().subscribe({
      next: (resposta) => {
        if (resposta.sucesso && resposta.dados) {
          const dados = resposta.dados;
          
          // Imóveis
          this.totalImoveis = dados.imoveis.total;
          this.imoveisDisponiveis = dados.imoveis.disponiveis;
          this.imoveisArrendados = dados.imoveis.arrendados;
          this.imoveisEmAnalise = dados.imoveis.em_analise;
          
          // Utilizadores
          this.totalUtilizadores = dados.utilizadores.total;
          this.totalProprietarios = dados.utilizadores.proprietarios;
          this.totalArrendatarios = dados.utilizadores.arrendatarios;
          
          // Solicitações
          this.totalSolicitacoes = dados.solicitacoes.total;
          this.solicitacoesPendentes = dados.solicitacoes.pendentes;
        }
        this.carregando = false;
      },
      error: (erro) => {
        this.erro = 'Erro ao carregar estatísticas';
        this.carregando = false;
        console.error('Erro:', erro);
      }
    });
  }
}