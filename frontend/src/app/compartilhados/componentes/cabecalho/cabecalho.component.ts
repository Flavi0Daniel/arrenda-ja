import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AutenticacaoService } from '../../../servicos/autenticacao.service';
import { MensagemService } from '../../../servicos/mensagem.service';
import { SolicitacaoService } from '../../../servicos/solicitacao.service';
import { Utilizador } from '../../../modelos/utilizador.model';


@Component({
  selector: 'app-cabecalho',
  templateUrl: './cabecalho.component.html',
  styleUrls: ['./cabecalho.component.css']
})
export class CabecalhoComponent implements OnInit{

  utilizadorAtual: Utilizador | null = null;
  mensagensNaoLidas = 0;
  solicitacoesPendentes = 0;

  constructor(
    public autenticacaoService: AutenticacaoService,
    private mensagemService: MensagemService,
    private solicitacaoService: SolicitacaoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Observar mudanças no utilizador autenticado
    this.autenticacaoService.utilizadorAtual$.subscribe(utilizador => {
      this.utilizadorAtual = utilizador;
      
      if (utilizador) {
        this.carregarNotificacoes();
      }
    });
  }

  carregarNotificacoes(): void {
    // Carregar mensagens não lidas
    this.mensagemService.mensagensNaoLidas$.subscribe(total => {
      this.mensagensNaoLidas = total;
    });

    // Carregar solicitações pendentes (apenas para proprietários)
    if (this.autenticacaoService.eProprietario()) {
      this.solicitacaoService.contarPendentes().subscribe(resposta => {
        if (resposta.sucesso && resposta.dados) {
          this.solicitacoesPendentes = resposta.dados.total;
        }
      });
    }
  }

  sair(): void {
    this.autenticacaoService.sair();
  }

  navegarPainelUtilizador(): void {
    if (this.autenticacaoService.eProprietario()) {
      this.router.navigate(['/proprietario/painel']);
    } else if (this.autenticacaoService.eArrendatario()) {
      this.router.navigate(['/arrendatario/painel']);
    } else if (this.autenticacaoService.eAdministrador()) {
      this.router.navigate(['/administrador/painel']);
    }
  }

}


 
