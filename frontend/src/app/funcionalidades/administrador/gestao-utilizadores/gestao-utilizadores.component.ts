import { Component, OnInit } from '@angular/core';
import { UtilizadorService } from '../../../servicos/utilizador.service';
import { Utilizador } from '../../../modelos/utilizador.model';

@Component({
  selector: 'app-gestao-utilizadores',
  templateUrl: './gestao-utilizadores.component.html',
  styleUrls: ['./gestao-utilizadores.component.css']
})
export class GestaoUtilizadoresComponent implements OnInit  {

  utilizadores: Utilizador[] = [];
  utilizadoresFiltrados: Utilizador[] = [];
  carregando = false;
  erro: string | null = null;
  sucesso: string | null = null;
 
  // Filtros
  filtroTipo: string = 'todos';
  filtroStatus: string = 'ativos';
  termoBusca: string = '';
 
  // Estatísticas
  estatisticas = {
    total: 0,
    proprietarios: 0,
    arrendatarios: 0,
    administradores: 0,
    ativos: 0,
    inativos: 0
  };
 
  // Modal
  mostrarModalCriar = false;
  utilizadorEdicao: Utilizador | null = null;
 
  constructor(private utilizadorService: UtilizadorService) {}
 
  ngOnInit(): void {
    this.carregarUtilizadores();
  }
 
  carregarUtilizadores(): void {
    this.carregando = true;
    this.erro = null;
 
    this.utilizadorService.listarTodos().subscribe({
      next: (resposta) => {
        if (resposta.sucesso && resposta.dados) {
          this.utilizadores = resposta.dados.utilizadores;
          this.calcularEstatisticas();
          this.aplicarFiltros();
        }
        this.carregando = false;
      },
      error: (erro) => {
        this.erro = 'Erro ao carregar utilizadores';
        this.carregando = false;
        console.error('Erro:', erro);
      }
    });
  }
 
  calcularEstatisticas(): void {
    this.estatisticas = {
      total: this.utilizadores.length,
      proprietarios: this.utilizadores.filter(u => u.tipoUtilizador === 'proprietario').length,
      arrendatarios: this.utilizadores.filter(u => u.tipoUtilizador === 'arrendatario').length,
      administradores: this.utilizadores.filter(u => u.tipoUtilizador === 'administrador').length,
      ativos: this.utilizadores.filter(u => u.estaAtivo).length,
      inativos: this.utilizadores.filter(u => !u.estaAtivo).length
    };
  }
 
  aplicarFiltros(): void {
    let resultado = [...this.utilizadores];
 
    // Filtro por tipo
    if (this.filtroTipo !== 'todos') {
      resultado = resultado.filter(u => u.tipoUtilizador === this.filtroTipo);
    }
 
    // Filtro por status
    if (this.filtroStatus === 'ativos') {
      resultado = resultado.filter(u => u.estaAtivo);
    } else if (this.filtroStatus === 'inativos') {
      resultado = resultado.filter(u => !u.estaAtivo);
    }
 
    // Busca por nome ou email
    if (this.termoBusca.trim()) {
      const termo = this.termoBusca.toLowerCase();
      resultado = resultado.filter(u => 
        u.nomeCompleto.toLowerCase().includes(termo) ||
        u.email.toLowerCase().includes(termo)
      );
    }
 
    this.utilizadoresFiltrados = resultado;
  }
 
  abrirModalCriar(): void {
    this.utilizadorEdicao = null;
    this.mostrarModalCriar = true;
  }
 
  abrirModalEditar(utilizador: Utilizador): void {
    this.utilizadorEdicao = utilizador;
    this.mostrarModalCriar = true;
  }
 
  fecharModal(): void {
    this.mostrarModalCriar = false;
    this.utilizadorEdicao = null;
  }
 
  onUtilizadorSalvo(): void {
    this.fecharModal();
    this.sucesso = 'Utilizador salvo com sucesso!';
    this.carregarUtilizadores();
    setTimeout(() => this.sucesso = null, 3000);
  }
 
  desativar(utilizador: Utilizador): void {
    if (!confirm(`Tem certeza que deseja desativar ${utilizador.nomeCompleto}?`)) return;
 
    this.utilizadorService.desativar(utilizador.id).subscribe({
      next: (resposta) => {
        if (resposta.sucesso) {
          this.sucesso = 'Utilizador desativado com sucesso!';
          this.carregarUtilizadores();
          setTimeout(() => this.sucesso = null, 3000);
        }
      },
      error: (erro) => {
        this.erro = erro.error?.mensagem || 'Erro ao desativar utilizador';
      }
    });
  }
 
  reativar(utilizador: Utilizador): void {
    if (!confirm(`Tem certeza que deseja reativar ${utilizador.nomeCompleto}?`)) return;
 
    this.utilizadorService.reativar(utilizador.id).subscribe({
      next: (resposta) => {
        if (resposta.sucesso) {
          this.sucesso = 'Utilizador reativado com sucesso!';
          this.carregarUtilizadores();
          setTimeout(() => this.sucesso = null, 3000);
        }
      },
      error: (erro) => {
        this.erro = erro.error?.mensagem || 'Erro ao reativar utilizador';
      }
    });
  }
 
  obterCorTipo(tipo: string): string {
    const cores: { [key: string]: string } = {
      'proprietario': 'primary',
      'arrendatario': 'success',
      'administrador': 'danger'
    };
    return cores[tipo] || 'secondary';
  }
 
  obterTextoTipo(tipo: string): string {
    const textos: { [key: string]: string } = {
      'proprietario': 'Proprietário',
      'arrendatario': 'Arrendatário',
      'administrador': 'Administrador'
    };
    return textos[tipo] || tipo;
  }
 
  obterIniciais(nome: string): string {
    return this.utilizadorService.obterIniciais(nome);
  }

}
