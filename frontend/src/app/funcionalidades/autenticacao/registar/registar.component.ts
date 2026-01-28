import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AutenticacaoService } from '../../../servicos/autenticacao.service';

@Component({
  selector: 'app-registar',
  templateUrl: './registar.component.html',
  styleUrls: ['./registar.component.css']
})
export class RegistarComponent implements OnInit {
  formulario!: FormGroup;
  carregando = false;
  erro: string | null = null;
  sucesso = false;
  mostrarSenha = false;
  mostrarConfirmarSenha = false;

  constructor(
    private formBuilder: FormBuilder,
    private autenticacaoService: AutenticacaoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Se já estiver autenticado, redirecionar
    if (this.autenticacaoService.estaAutenticado()) {
      this.router.navigate(['/']);
    }

    // Criar formulário
    this.formulario = this.formBuilder.group({
      nomeCompleto: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', [Validators.pattern(/^(\+244)?[9][0-9]{8}$/)]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      confirmarSenha: ['', [Validators.required]],
      tipoUtilizador: ['arrendatario', [Validators.required]]
    }, { validators: this.validadorSenhasIguais });
  }

  registar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.carregando = true;
    this.erro = null;

    const { confirmarSenha, ...dadosRegistro } = this.formulario.value;

    this.autenticacaoService.registar(dadosRegistro).subscribe({
      next: (resposta) => {
        if (resposta.sucesso) {
          this.sucesso = true;
          
          setTimeout(() => {
            // Redirecionar baseado no tipo de utilizador
            const utilizador = resposta.dados.utilizador;
            
            if (utilizador.tipoUtilizador === 'proprietario') {
              this.router.navigate(['/proprietario/painel']);
            } else if (utilizador.tipoUtilizador === 'arrendatario') {
              this.router.navigate(['/arrendatario/painel']);
            } else {
              this.router.navigate(['/']);
            }
          }, 2000);
        }
      },
      error: (erro) => {
        this.erro = erro.message || 'Erro ao registar. Tente novamente.';
        this.carregando = false;
      }
    });
  }

  validadorSenhasIguais(form: FormGroup) {
    const senha = form.get('senha')?.value;
    const confirmarSenha = form.get('confirmarSenha')?.value;
    
    return senha === confirmarSenha ? null : { senhasDiferentes: true };
  }

  alternarVisibilidadeSenha(): void {
    this.mostrarSenha = !this.mostrarSenha;
  }

  alternarVisibilidadeConfirmarSenha(): void {
    this.mostrarConfirmarSenha = !this.mostrarConfirmarSenha;
  }

  // Getters
  get nomeCompleto() { return this.formulario.get('nomeCompleto'); }
  get email() { return this.formulario.get('email'); }
  get telefone() { return this.formulario.get('telefone'); }
  get senha() { return this.formulario.get('senha'); }
  get confirmarSenha() { return this.formulario.get('confirmarSenha'); }
  get tipoUtilizador() { return this.formulario.get('tipoUtilizador'); }
}