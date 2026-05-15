import { Component, EventEmitter, Output } from '@angular/core';
import { UtilizadorService } from '../../../servicos/utilizador.service';

@Component({
  selector: 'app-alterar-senha',
  templateUrl: './alterar-senha.component.html',
  styleUrls: ['./alterar-senha.component.css']
})
export class AlterarSenhaComponent {

  @Output() fechar = new EventEmitter<void>();
 
  processando = false;
  erro: string | null = null;
  sucesso = false;
 
  senhaAtual = '';
  novaSenha = '';
  confirmarSenha = '';
 
  mostrarSenhaAtual = false;
  mostrarNovaSenha = false;
  mostrarConfirmarSenha = false;
 
  constructor(private utilizadorService: UtilizadorService) {}
 
  alterarSenha(): void {
    // Validações
    if (!this.senhaAtual || !this.novaSenha || !this.confirmarSenha) {
      this.erro = 'Todos os campos são obrigatórios';
      return;
    }
 
    if (this.novaSenha.length < 6) {
      this.erro = 'A nova senha deve ter pelo menos 6 caracteres';
      return;
    }
 
    if (this.novaSenha !== this.confirmarSenha) {
      this.erro = 'As senhas não coincidem';
      return;
    }
 
    if (this.senhaAtual === this.novaSenha) {
      this.erro = 'A nova senha deve ser diferente da senha atual';
      return;
    }
 
    this.processando = true;
    this.erro = null;
 
    this.utilizadorService.alterarSenha({
      senhaAtual: this.senhaAtual,
      novaSenha: this.novaSenha
    }).subscribe({
      next: (resposta) => {
        if (resposta.sucesso) {
          this.sucesso = true;
          setTimeout(() => {
            this.fecharModal();
          }, 2000);
        }
        this.processando = false;
      },
      error: (erro) => {
        this.erro = erro.error?.mensagem || 'Erro ao alterar senha';
        this.processando = false;
      }
    });
  }
 
  fecharModal(): void {
    this.fechar.emit();
  }
 
  toggleMostrarSenha(campo: 'atual' | 'nova' | 'confirmar'): void {
    switch (campo) {
      case 'atual':
        this.mostrarSenhaAtual = !this.mostrarSenhaAtual;
        break;
      case 'nova':
        this.mostrarNovaSenha = !this.mostrarNovaSenha;
        break;
      case 'confirmar':
        this.mostrarConfirmarSenha = !this.mostrarConfirmarSenha;
        break;
    }
  }

}
