import { Component, OnInit } from '@angular/core';
import { UtilizadorService } from '../../../servicos/utilizador.service';
import { AutenticacaoService } from '../../../servicos/autenticacao.service';
import { Utilizador } from '../../../modelos/utilizador.model';

@Component({
  selector: 'app-meu-perfil',
  templateUrl: './meu-perfil.component.html',
  styleUrls: ['./meu-perfil.component.css']
})
export class MeuPerfilComponent implements OnInit {

  utilizador: Utilizador | null = null;
  carregando = false;
  editando = false;
  salvando = false;
  uploadandoFoto = false;
  erro: string | null = null;
  sucesso: string | null = null;
 
  // Dados para edição
  dadosEdicao = {
    nomeCompleto: '',
    telefone: ''
  };
 
  // Modal de alterar senha
  mostrarModalSenha = false;
 
  constructor(
    private utilizadorService: UtilizadorService,
    private autenticacaoService: AutenticacaoService
  ) {}
 
  ngOnInit(): void {
    this.carregarPerfil();
  }
 
  carregarPerfil(): void {
    this.carregando = true;
    this.erro = null;
 
    this.utilizadorService.obterPerfil().subscribe({
      next: (resposta) => {
        if (resposta.sucesso && resposta.dados) {
          this.utilizador = resposta.dados;
          this.dadosEdicao = {
            nomeCompleto: this.utilizador.nomeCompleto,
            telefone: this.utilizador.telefone || ''
          };
        }
        this.carregando = false;
      },
      error: (erro) => {
        this.erro = 'Erro ao carregar perfil';
        this.carregando = false;
        console.error('Erro:', erro);
      }
    });
  }
 
  ativarEdicao(): void {
    this.editando = true;
    this.sucesso = null;
    this.erro = null;
  }
 
  cancelarEdicao(): void {
    if (this.utilizador) {
      this.dadosEdicao = {
        nomeCompleto: this.utilizador.nomeCompleto,
        telefone: this.utilizador.telefone || ''
      };
    }
    this.editando = false;
    this.erro = null;
  }
 
  salvarPerfil(): void {
    if (!this.dadosEdicao.nomeCompleto.trim()) {
      this.erro = 'O nome completo é obrigatório';
      return;
    }
 
    this.salvando = true;
    this.erro = null;
 
    this.utilizadorService.atualizarPerfil({
      nomeCompleto: this.dadosEdicao.nomeCompleto.trim(),
      telefone: this.dadosEdicao.telefone.trim() || undefined
    }).subscribe({
      next: (resposta) => {
        if (resposta.sucesso && resposta.dados) {
          this.utilizador = resposta.dados;
          this.editando = false;
          this.sucesso = 'Perfil atualizado com sucesso!';
          
          // Atualizar dados no localStorage
          this.autenticacaoService.atualizarUtilizadorLocal(resposta.dados);
          
          setTimeout(() => this.sucesso = null, 3000);
        }
        this.salvando = false;
      },
      error: (erro) => {
        this.erro = erro.error?.mensagem || 'Erro ao atualizar perfil';
        this.salvando = false;
      }
    });
  }
 
  onFotoSelecionada(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
 
    const arquivo = input.files[0];
 
    // Validar tipo de arquivo
    if (!arquivo.type.match(/image\/(jpeg|jpg|png|webp)/)) {
      this.erro = 'Apenas imagens JPEG, PNG ou WEBP são permitidas';
      return;
    }
 
    // Validar tamanho (5MB)
    if (arquivo.size > 5 * 1024 * 1024) {
      this.erro = 'A imagem deve ter no máximo 5MB';
      return;
    }
 
    this.uploadarFoto(arquivo);
  }
 
  uploadarFoto(arquivo: File): void {
    this.uploadandoFoto = true;
    this.erro = null;
 
    this.utilizadorService.uploadFotoPerfil(arquivo).subscribe({
      next: (resposta) => {
        if (resposta.sucesso && resposta.dados) {
          this.sucesso = 'Foto atualizada com sucesso!';
          this.carregarPerfil();
          setTimeout(() => this.sucesso = null, 3000);
        }
        this.uploadandoFoto = false;
      },
      error: (erro) => {
        this.erro = erro.error?.mensagem || 'Erro ao fazer upload da foto';
        this.uploadandoFoto = false;
      }
    });
  }
 
  abrirModalSenha(): void {
    this.mostrarModalSenha = true;
  }
 
  fecharModalSenha(): void {
    this.mostrarModalSenha = false;
  }
 
  obterUrlFotoPerfil(): string {
    return this.utilizadorService.obterUrlFotoPerfil(this.utilizador?.fotoPerfil);
  }
 
  obterIniciais(): string {
    return this.utilizadorService.obterIniciais(this.utilizador?.nomeCompleto || '');
  }
 
  obterTipoUtilizadorTexto(): string {
    const tipos: { [key: string]: string } = {
      'proprietario': 'Proprietário',
      'arrendatario': 'Arrendatário',
      'administrador': 'Administrador'
    };
    return tipos[this.utilizador?.tipoUtilizador || ''] || 'Utilizador';
  }
 
  obterCorTipo(): string {
    const cores: { [key: string]: string } = {
      'proprietario': 'primary',
      'arrendatario': 'success',
      'administrador': 'danger'
    };
    return cores[this.utilizador?.tipoUtilizador || ''] || 'secondary';
  }

}
