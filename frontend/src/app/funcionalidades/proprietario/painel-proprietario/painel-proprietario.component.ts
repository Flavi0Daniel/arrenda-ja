import { Component, OnInit } from '@angular/core';
import { ImovelService } from '../../../servicos/imovel.service';
import { SolicitacaoService } from '../../../servicos/solicitacao.service';
import { EstatisticaService } from '../../../servicos/estatistica.service';
import { AutenticacaoService } from '../../../servicos/autenticacao.service';
import { Imovel } from '../../../modelos/imovel.model';
import { Solicitacao } from '../../../modelos/solicitacao.model';

@Component({
  selector: 'app-painel-proprietario',
  templateUrl: './painel-proprietario.component.html',
  styleUrls: ['./painel-proprietario.component.css']
})
export class PainelProprietarioComponent implements OnInit {
  carregando = true;
  
  // Estatísticas
  totalImoveis = 0;
  imoveisDisponiveis = 0;
  imoveisArrendados = 0;
  imoveisEmAnalise = 0;
  solicitacoesPendentes = 0;
  
  // Dados
  ultimosImoveis: Imovel[] = [];
  ultimasSolicitacoes: Solicitacao[] = [];
  
  nomeUtilizador = '';

  constructor(
    private imovelService: ImovelService,
    private solicitacaoService: SolicitacaoService,
    private estatisticaService: EstatisticaService,
    public autenticacaoService: AutenticacaoService
  ) {}

  ngOnInit(): void {
    const utilizador = this.autenticacaoService.obterUtilizadorAtual();
    this.nomeUtilizador = utilizador?.nomeCompleto || 'Proprietário';
    
    this.carregarDados();
  }

  carregarDados(): void {
    this.carregando = true;
    
    const utilizador = this.autenticacaoService.obterUtilizadorAtual();
    if (!utilizador) return;

    // Carregar estatísticas
    this.estatisticaService.obterEstatisticasProprietario(utilizador.id).subscribe({
      next: (resposta) => {
        if (resposta.sucesso && resposta.dados) {
          const dados = resposta.dados;
          
          this.totalImoveis = dados.imoveis.total;
          this.imoveisDisponiveis = dados.imoveis.disponiveis;
          this.imoveisArrendados = dados.imoveis.arrendados;
          this.imoveisEmAnalise = dados.imoveis.em_analise;
          this.solicitacoesPendentes = dados.solicitacoes.pendentes;
        }
      },
      error: (erro) => console.error('Erro ao carregar estatísticas:', erro)
    });

    // Carregar últimos imóveis
    this.imovelService.listarMeus().subscribe({
      next: (resposta) => {
        if (resposta.sucesso && resposta.dados) {
          this.ultimosImoveis = resposta.dados.slice(0, 3);
        }
        this.carregando = false;
      },
      error: (erro) => {
        console.error('Erro ao carregar imóveis:', erro);
        this.carregando = false;
      }
    });

    // Carregar últimas solicitações
    this.solicitacaoService.listarRecebidas('pendente').subscribe({
      next: (resposta) => {
        if (resposta.sucesso && resposta.dados) {
          this.ultimasSolicitacoes = resposta.dados.slice(0, 5);
        }
      },
      error: (erro) => console.error('Erro ao carregar solicitações:', erro)
    });
  }

  obterUrlFoto(caminho: string): string {
    return this.imovelService.obterUrlFoto(caminho);
  }

  formatarPreco(preco: number): string {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA'
    }).format(preco);
  }

  obterCorStatus(status: string): string {
    const cores: { [key: string]: string } = {
      'disponivel': 'success',
      'arrendado': 'danger',
      'em_analise': 'warning',
      'inativo': 'secondary'
    };
    return cores[status] || 'secondary';
  }

  obterTextoStatus(status: string): string {
    const textos: { [key: string]: string } = {
      'disponivel': 'Disponível',
      'arrendado': 'Arrendado',
      'em_analise': 'Em Análise',
      'inativo': 'Inativo'
    };
    return textos[status] || status;
  }
}