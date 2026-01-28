import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ImovelService } from '../../../servicos/imovel.service';
import { Imovel } from '../../../modelos/imovel.model';

@Component({
  selector: 'app-meus-imoveis',
  templateUrl: './meus-imoveis.component.html',
  styleUrls: ['./meus-imoveis.component.css']
})
export class MeusImoveisComponent implements OnInit {
  imoveis: Imovel[] = [];
  imoveisFiltrados: Imovel[] = [];
  carregando = false;
  erro: string | null = null;
  
  // Filtro
  filtroStatus: string = 'todos';

  constructor(
    private imovelService: ImovelService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarImoveis();
  }

  carregarImoveis(): void {
    this.carregando = true;
    this.erro = null;

    this.imovelService.listarMeus().subscribe({
      next: (resposta) => {
        if (resposta.sucesso && resposta.dados) {
          this.imoveis = resposta.dados;
          this.aplicarFiltro();
        }
        this.carregando = false;
      },
      error: (erro) => {
        this.erro = 'Erro ao carregar imóveis';
        this.carregando = false;
        console.error('Erro:', erro);
      }
    });
  }

  aplicarFiltro(): void {
    if (this.filtroStatus === 'todos') {
      this.imoveisFiltrados = this.imoveis;
    } else {
      this.imoveisFiltrados = this.imoveis.filter(i => i.status === this.filtroStatus);
    }
  }

  marcarComoArrendado(imovelId: number): void {
    if (confirm('Tem certeza que deseja marcar este imóvel como arrendado?')) {
      this.imovelService.marcarComoArrendado(imovelId).subscribe({
        next: (resposta) => {
          if (resposta.sucesso) {
            alert('Imóvel marcado como arrendado!');
            this.carregarImoveis();
          }
        },
        error: (erro) => {
          alert('Erro ao atualizar imóvel');
          console.error('Erro:', erro);
        }
      });
    }
  }

  editarImovel(imovelId: number): void {
    this.router.navigate(['/proprietario/editar-imovel', imovelId]);
  }

  verDetalhes(imovelId: number): void {
    this.router.navigate(['/imoveis', imovelId]);
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