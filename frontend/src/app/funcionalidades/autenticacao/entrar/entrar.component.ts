import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AutenticacaoService } from '../../../servicos/autenticacao.service';

@Component({
  selector: 'app-entrar',
  templateUrl: './entrar.component.html',
  styleUrls: ['./entrar.component.css']
})
export class EntrarComponent implements OnInit {
  formulario!: FormGroup;
  carregando = false;
  erro: string | null = null;
  returnUrl: string = '/';
  mostrarSenha = false;

  constructor(
    private formBuilder: FormBuilder,
    private autenticacaoService: AutenticacaoService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Obter URL de retorno
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    // Se já estiver autenticado, redirecionar
    if (this.autenticacaoService.estaAutenticado()) {
      this.router.navigate([this.returnUrl]);
    }

    // Criar formulário
    this.formulario = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  entrar(): void {
  if (this.formulario.invalid) {
    this.formulario.markAllAsTouched();
    return;
  }

  this.carregando = true;
  this.erro = null;

  console.log('📤 Enviando dados de login:', this.formulario.value);

  this.autenticacaoService.entrar(this.formulario.value).subscribe({
    next: (resposta) => {
      console.log('✅ Resposta do servidor:', resposta);
      
      if (resposta.sucesso) {
        const utilizador = resposta.dados.utilizador;
        
        if (utilizador.tipoUtilizador === 'proprietario') {
          this.router.navigate(['/proprietario/painel']);
        } else if (utilizador.tipoUtilizador === 'arrendatario') {
          this.router.navigate(['/arrendatario/painel']);
        } else if (utilizador.tipoUtilizador === 'administrador') {
          this.router.navigate(['/administrador/painel']);
        } else {
          this.router.navigate([this.returnUrl]);
        }
      }
    },
    error: (erro) => {
      console.error('❌ Erro ao fazer login:', erro);
      this.erro = erro.message || 'Erro ao fazer login. Verifique suas credenciais.';
      this.carregando = false;
    }
  });
}

  alternarVisibilidadeSenha(): void {
    this.mostrarSenha = !this.mostrarSenha;
  }

  // Getters para facilitar acesso aos campos no template
  get email() { return this.formulario.get('email'); }
  get senha() { return this.formulario.get('senha'); }
}