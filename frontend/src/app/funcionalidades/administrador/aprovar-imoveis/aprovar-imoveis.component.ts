import { Component, OnInit } from '@angular/core';
import { ImovelService } from '../../../servicos/imovel.service';
import { Imovel } from '../../../modelos/imovel.model';

@Component({
  selector: 'app-aprovar-imoveis',
  templateUrl: './aprovar-imoveis.component.html',
  styleUrls: ['./aprovar-imoveis.component.css']
})
export class AprovarImoveisComponent implements OnInit {
  imoveis: Imovel[] = [];
  imoveisFiltrados: Imovel[] = [];
  carregando = false;
  erro: string | null = null;
  
  filtroStatus: string = 'em_analise';
  
  // Modal de detalhes
  mostrarModal = false;
  imovelSelecionado: Imovel | null = null;
  processando = false;

  constructor(private imovelService: ImovelService) {}

  ngOnInit(): void {
    this.carregarImoveis();
  }

  carregarImoveis(): void {
    this.carregando = true;
    this.erro = null;

    // Usar o endpoint de admin para listar TODOS os imóveis
    this.imovelService.listarTodos().subscribe({
      next: (resposta) => {
        if (resposta.sucesso && resposta.dados) {
          this.imoveis = resposta.dados;
          // DEBUG - Ver o que está vindo do backend
          console.log('🔍 Imóveis recebidos:', this.imoveis);
          console.log('🔍 Primeiro imóvel:', this.imoveis[0]);
          console.log('🔍 Foto principal do primeiro:', this.imoveis[0]?.foto_principal);
          console.log('🔍 Foto principal (camelCase):', this.imoveis[0]?.fotoPrincipal);
          console.log('🔍 Todos os campos do primeiro imóvel:', JSON.stringify(this.imoveis[0], null, 2));


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

  abrirModal(imovel: Imovel): void {
    this.imovelSelecionado = imovel;
    this.mostrarModal = true;
  }

  fecharModal(): void {
    this.mostrarModal = false;
    this.imovelSelecionado = null;
  }

  aprovar(imovelId: number): void {
    if (confirm('Tem certeza que deseja aprovar este imóvel?')) {
      this.processando = true;

      this.imovelService.alterarStatus(imovelId, 'disponivel').subscribe({
        next: (resposta) => {
          if (resposta.sucesso) {
            alert('Imóvel aprovado com sucesso!');
            this.fecharModal();
            this.carregarImoveis();
          }
          this.processando = false;
        },
        error: (erro) => {
          alert('Erro ao aprovar imóvel');
          this.processando = false;
        }
      });
    }
  }

  recusar(imovelId: number): void {
    const motivo = prompt('Motivo da recusa (será enviado ao proprietário):');
    
    if (motivo) {
      this.processando = true;

      this.imovelService.alterarStatus(imovelId, 'inativo').subscribe({
        next: (resposta) => {
          if (resposta.sucesso) {
            alert('Imóvel recusado');
            this.fecharModal();
            this.carregarImoveis();
          }
          this.processando = false;
        },
        error: (erro) => {
          alert('Erro ao recusar imóvel');
          this.processando = false;
        }
      });
    }
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
      'disponivel': 'Aprovado',
      'arrendado': 'Arrendado',
      'em_analise': 'Em Análise',
      'inativo': 'Recusado'
    };
    return textos[status] || status;
  }
}