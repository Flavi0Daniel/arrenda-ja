import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ImovelService } from '../../../servicos/imovel.service';
import { CondominioService } from '../../../servicos/condominio.service';
import { Imovel, FiltrosPesquisa } from '../../../modelos/imovel.model';

@Component({
  selector: 'app-lista-imoveis',
  templateUrl: './lista-imoveis.component.html',
  styleUrls: ['./lista-imoveis.component.css']
})
export class ListaImoveisComponent implements OnInit {
  imoveis: Imovel[] = [];
  carregando = false;
  erro: string | null = null;
  
  // Filtros
  filtros: FiltrosPesquisa = {
    pagina: 1,
    itensPorPagina: 12
  };
  
  // Dados para filtros
  provincias: string[] = [];
  municipios: string[] = [];
  tipologias = ['T0', 'T1', 'T2', 'T3', 'T4', 'T5+'];
  
  // Controle de exibição
  mostrarFiltros = false;
  totalResultados = 0;

  constructor(
    private imovelService: ImovelService,
    private condominioService: CondominioService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarProvincias();
    this.carregarImoveis();
  }

  carregarProvincias(): void {
    this.condominioService.obterProvincias().subscribe({
      next: (resposta) => {
        if (resposta.sucesso && resposta.dados) {
          this.provincias = resposta.dados;
        }
      },
      error: (erro) => console.error('Erro ao carregar províncias:', erro)
    });
  }

  carregarMunicipios(provincia: string): void {
    if (!provincia) {
      this.municipios = [];
      return;
    }

    this.condominioService.obterMunicipios(provincia).subscribe({
      next: (resposta) => {
        if (resposta.sucesso && resposta.dados) {
          this.municipios = resposta.dados;
        }
      },
      error: (erro) => console.error('Erro ao carregar municípios:', erro)
    });
  }

  carregarImoveis(): void {
    this.carregando = true;
    this.erro = null;

    this.imovelService.pesquisar(this.filtros).subscribe({
      next: (resposta) => {
        if (resposta.sucesso && resposta.dados) {
          this.imoveis = resposta.dados.imoveis;
          this.totalResultados = resposta.dados.imoveis.length;
        }
        this.carregando = false;
      },
      error: (erro) => {
        this.erro = 'Erro ao carregar imóveis. Tente novamente.';
        this.carregando = false;
        console.error('Erro:', erro);
      }
    });
  }

  aplicarFiltros(): void {
    this.filtros.pagina = 1; // Resetar para primeira página
    this.carregarImoveis();
  }

  limparFiltros(): void {
    this.filtros = {
      pagina: 1,
      itensPorPagina: 12
    };
    this.municipios = [];
    this.carregarImoveis();
  }

  alternarFiltros(): void {
    this.mostrarFiltros = !this.mostrarFiltros;
  }

  onProvinciaChange(provincia: string): void {
    this.filtros.provincia = provincia;
    this.filtros.municipio = undefined;
    this.carregarMunicipios(provincia);
  }

  formatarPreco(preco: number): string {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA'
    }).format(preco);
  }
}