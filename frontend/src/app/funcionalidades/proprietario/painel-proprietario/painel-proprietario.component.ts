import { Component, OnInit } from '@angular/core';
import { ImovelService } from '../../../servicos/imovel.service';
import { SolicitacaoService } from '../../../servicos/solicitacao.service';
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
    public autenticacaoService: AutenticacaoService
  ) {}

  ngOnInit(): void {
    const utilizador = this.autenticacaoService.obterUtilizadorAtual();
    this.nomeUtilizador = utilizador?.nomeCompleto || 'Proprietário';
    
    this.carregarDados();
  }

  carregarDados(): void {
    this.carregando = true;

    // Carregar imóveis
    this.imovelService.listarMeus().subscribe({
      next: (resposta) => {
        if (resposta.sucesso && resposta.dados) {
          const imoveis = resposta.dados;
          
          this.totalImoveis = imoveis.length;
          this.imoveisDisponiveis = imoveis.filter(i => i.status === 'disponivel').length;
          this.imoveisArrendados = imoveis.filter(i => i.status === 'arrendado').length;
          this.imoveisEmAnalise = imoveis.filter(i => i.status === 'em_analise').length;
          
          // Últimos 3 imóveis
          this.ultimosImoveis = imoveis.slice(0, 3);
        }
        this.carregando = false;
      },
      error: (erro) => {
        console.error('Erro ao carregar imóveis:', erro);
        this.carregando = false;
      }
    });

    // Carregar solicitações pendentes
    this.solicitacaoService.contarPendentes().subscribe({
      next: (resposta) => {
        if (resposta.sucesso && resposta.dados) {
          this.solicitacoesPendentes = resposta.dados.total;
        }
      },
      error: (erro) => console.error('Erro ao contar solicitações:', erro)
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