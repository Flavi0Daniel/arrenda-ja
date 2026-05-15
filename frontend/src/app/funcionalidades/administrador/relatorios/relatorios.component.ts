import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
 
interface EstatisticasGerais {
  imoveis: {
    total: number;
    disponiveis: number;
    arrendados: number;
    em_analise: number;
    inativos: number;
  };
  utilizadores: {
    total: number;
    proprietarios: number;
    arrendatarios: number;
    administradores: number;
  };
  solicitacoes: {
    total: number;
    pendentes: number;
    aceites: number;
    recusadas: number;
  };
  mensagens: {
    total: number;
    nao_lidas: number;
  };
}

@Component({
  selector: 'app-relatorios',
  templateUrl: './relatorios.component.html',
  styleUrls: ['./relatorios.component.css']
})
export class RelatoriosComponent implements OnInit {

  carregando = false;
  erro: string | null = null;
 
  // Estatísticas gerais
  estatisticasGerais: EstatisticasGerais | null = null;
 
  // Relatório de Imóveis
  relatorioImoveis: any = null;
 
  // Relatório de Utilizadores
  relatorioUtilizadores: any = null;
 
  // Relatório Financeiro
  relatorioFinanceiro: any = null;
 
  // Aba ativa
  abaAtiva: 'geral' | 'imoveis' | 'utilizadores' | 'financeiro' = 'geral';
 
  private readonly API_URL = `${environment.apiUrl}/estatisticas`;
 
  constructor(private http: HttpClient) {}
 
  ngOnInit(): void {
    this.carregarEstatisticasGerais();
  }
 
  mudarAba(aba: 'geral' | 'imoveis' | 'utilizadores' | 'financeiro'): void {
    this.abaAtiva = aba;
 
    switch (aba) {
      case 'geral':
        if (!this.estatisticasGerais) this.carregarEstatisticasGerais();
        break;
      case 'imoveis':
        if (!this.relatorioImoveis) this.carregarRelatorioImoveis();
        break;
      case 'utilizadores':
        if (!this.relatorioUtilizadores) this.carregarRelatorioUtilizadores();
        break;
      case 'financeiro':
        if (!this.relatorioFinanceiro) this.carregarRelatorioFinanceiro();
        break;
    }
  }
 
  carregarEstatisticasGerais(): void {
    this.carregando = true;
    this.erro = null;
 
    this.http.get<any>(`${this.API_URL}/administrador`).subscribe({
      next: (resposta) => {
        if (resposta.sucesso && resposta.dados) {
          this.estatisticasGerais = resposta.dados;
        }
        this.carregando = false;
      },
      error: (erro) => {
        this.erro = 'Erro ao carregar estatísticas gerais';
        this.carregando = false;
        console.error('Erro:', erro);
      }
    });
  }
 
  carregarRelatorioImoveis(): void {
    this.carregando = true;
    this.erro = null;
 
    this.http.get<any>(`${this.API_URL}/relatorio-imoveis`).subscribe({
      next: (resposta) => {
        if (resposta.sucesso && resposta.dados) {
          this.relatorioImoveis = resposta.dados;
        }
        this.carregando = false;
      },
      error: (erro) => {
        this.erro = 'Erro ao carregar relatório de imóveis';
        this.carregando = false;
        console.error('Erro:', erro);
      }
    });
  }
 
  carregarRelatorioUtilizadores(): void {
    this.carregando = true;
    this.erro = null;
 
    this.http.get<any>(`${this.API_URL}/relatorio-utilizadores`).subscribe({
      next: (resposta) => {
        if (resposta.sucesso && resposta.dados) {
          this.relatorioUtilizadores = resposta.dados;
        }
        this.carregando = false;
      },
      error: (erro) => {
        this.erro = 'Erro ao carregar relatório de utilizadores';
        this.carregando = false;
        console.error('Erro:', erro);
      }
    });
  }
 
  carregarRelatorioFinanceiro(): void {
    this.carregando = true;
    this.erro = null;
 
    this.http.get<any>(`${this.API_URL}/relatorio-financeiro`).subscribe({
      next: (resposta) => {
        if (resposta.sucesso && resposta.dados) {
          this.relatorioFinanceiro = resposta.dados;
        }
        this.carregando = false;
      },
      error: (erro) => {
        this.erro = 'Erro ao carregar relatório financeiro';
        this.carregando = false;
        console.error('Erro:', erro);
      }
    });
  }
 
  formatarMoeda(valor: number): string {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA'
    }).format(valor);
  }
 
  formatarNumero(valor: number): string {
    return new Intl.NumberFormat('pt-AO').format(valor);
  }
 
  calcularPercentagem(parte: number, total: number): number {
    return total > 0 ? Math.round((parte / total) * 100) : 0;
  }
 
  formatarMes(mes: string): string {
    const [ano, mesNum] = mes.split('-');
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    return `${meses[parseInt(mesNum) - 1]}/${ano}`;
  }

}
