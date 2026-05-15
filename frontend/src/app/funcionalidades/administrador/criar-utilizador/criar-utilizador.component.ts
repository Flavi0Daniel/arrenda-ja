import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UtilizadorService } from '../../../servicos/utilizador.service';
import { Utilizador } from '../../../modelos/utilizador.model';

@Component({
  selector: 'app-criar-utilizador',
  templateUrl: './criar-utilizador.component.html',
  styleUrls: ['./criar-utilizador.component.css']
})
export class CriarUtilizadorComponent implements OnInit  {

  @Input() utilizador: Utilizador | null = null;
  @Output() fechar = new EventEmitter<void>();
  @Output() salvo = new EventEmitter<void>();
 
  processando = false;
  erro: string | null = null;
  modoEdicao = false;
 
  // Dados do formulário
  dados = {
    nomeCompleto: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    telefone: '',
    tipoUtilizador: 'arrendatario' as 'proprietario' | 'arrendatario' | 'administrador'
  };
 
  mostrarSenha = false;
  mostrarConfirmarSenha = false;
 
  constructor(private utilizadorService: UtilizadorService) {}
 
  ngOnInit(): void {
    if (this.utilizador) {
      this.modoEdicao = true;
      this.dados = {
        nomeCompleto: this.utilizador.nomeCompleto,
        email: this.utilizador.email,
        senha: '',
        confirmarSenha: '',
        telefone: this.utilizador.telefone || '',
        tipoUtilizador: this.utilizador.tipoUtilizador
      };
    }
  }
 
  salvar(): void {
    if (!this.validarFormulario()) return;
 
    this.processando = true;
    this.erro = null;
 
    if (this.modoEdicao) {
      this.editar();
    } else {
      this.criar();
    }
  }
 
  criar(): void {
    this.utilizadorService.criar({
      nomeCompleto: this.dados.nomeCompleto.trim(),
      email: this.dados.email.trim(),
      senha: this.dados.senha,
      telefone: this.dados.telefone.trim() || undefined,
      tipoUtilizador: this.dados.tipoUtilizador
    }).subscribe({
      next: (resposta) => {
        if (resposta.sucesso) {
          this.salvo.emit();
        }
        this.processando = false;
      },
      error: (erro) => {
        this.erro = erro.error?.mensagem || 'Erro ao criar utilizador';
        this.processando = false;
      }
    });
  }
 
  editar(): void {
    if (!this.utilizador) return;
 
    this.utilizadorService.editar(this.utilizador.id, {
      nomeCompleto: this.dados.nomeCompleto.trim(),
      telefone: this.dados.telefone.trim() || undefined,
      tipoUtilizador: this.dados.tipoUtilizador
    }).subscribe({
      next: (resposta) => {
        if (resposta.sucesso) {
          this.salvo.emit();
        }
        this.processando = false;
      },
      error: (erro) => {
        this.erro = erro.error?.mensagem || 'Erro ao atualizar utilizador';
        this.processando = false;
      }
    });
  }
 
  validarFormulario(): boolean {
    // Nome completo
    if (!this.dados.nomeCompleto.trim()) {
      this.erro = 'O nome completo é obrigatório';
      return false;
    }
 
    // Email (apenas na criação)
    if (!this.modoEdicao) {
      if (!this.dados.email.trim()) {
        this.erro = 'O email é obrigatório';
        return false;
      }
 
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.dados.email)) {
        this.erro = 'Email inválido';
        return false;
      }
 
      // Senha
      if (!this.dados.senha) {
        this.erro = 'A senha é obrigatória';
        return false;
      }
 
      if (this.dados.senha.length < 6) {
        this.erro = 'A senha deve ter pelo menos 6 caracteres';
        return false;
      }
 
      if (this.dados.senha !== this.dados.confirmarSenha) {
        this.erro = 'As senhas não coincidem';
        return false;
      }
    }
 
    return true;
  }
 
  fecharModal(): void {
    this.fechar.emit();
  }
 
  toggleMostrarSenha(): void {
    this.mostrarSenha = !this.mostrarSenha;
  }
 
  toggleMostrarConfirmarSenha(): void {
    this.mostrarConfirmarSenha = !this.mostrarConfirmarSenha;
  }

}
