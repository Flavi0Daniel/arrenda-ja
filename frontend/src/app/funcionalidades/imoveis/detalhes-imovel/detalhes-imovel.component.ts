import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ImovelService } from '../../../servicos/imovel.service';
import { SolicitacaoService } from '../../../servicos/solicitacao.service';
import { AutenticacaoService } from '../../../servicos/autenticacao.service';
import { Imovel } from '../../../modelos/imovel.model';

@Component({
  selector: 'app-detalhes-imovel',
  templateUrl: './detalhes-imovel.component.html',
  styleUrls: ['./detalhes-imovel.component.css']
})
export class DetalhesImovelComponent implements OnInit {
  imovel: Imovel | null = null;
  carregando = false;
  erro: string | null = null;
  
  // Modal de solicitação
  mostrarModalSolicitacao = false;
  mensagemSolicitacao = '';
  enviandoSolicitacao = false;
  
  // Galeria de fotos
  fotoAtual = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private imovelService: ImovelService,
    private solicitacaoService: SolicitacaoService,
    public autenticacaoService: AutenticacaoService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.carregarImovel(id);
  }

  carregarImovel(id: number): void {
    this.carregando = true;
    this.erro = null;

    this.imovelService.obterPorId(id).subscribe({
      next: (resposta) => {
        if (resposta.sucesso && resposta.dados) {
          this.imovel = resposta.dados;
        } else {
          this.erro = 'Imóvel não encontrado';
        }
        this.carregando = false;
      },
      error: (erro) => {
        this.erro = 'Erro ao carregar detalhes do imóvel';
        this.carregando = false;
        console.error('Erro:', erro);
      }
    });
  }

  abrirModalSolicitacao(): void {
    if (!this.autenticacaoService.estaAutenticado()) {
      this.router.navigate(['/entrar'], { 
        queryParams: { returnUrl: this.router.url } 
      });
      return;
    }

    if (!this.autenticacaoService.eArrendatario()) {
      alert('Apenas arrendatários podem solicitar imóveis');
      return;
    }

    this.mostrarModalSolicitacao = true;
  }

  fecharModalSolicitacao(): void {
    this.mostrarModalSolicitacao = false;
    this.mensagemSolicitacao = '';
  }

  enviarSolicitacao(): void {
    if (!this.imovel) return;

    this.enviandoSolicitacao = true;

    this.solicitacaoService.criar({
      imovelId: this.imovel.id,
      mensagem: this.mensagemSolicitacao
    }).subscribe({
      next: (resposta) => {
        if (resposta.sucesso) {
          alert('Solicitação enviada com sucesso!');
          this.fecharModalSolicitacao();
        }
        this.enviandoSolicitacao = false;
      },
      error: (erro) => {
        alert(erro.message || 'Erro ao enviar solicitação');
        this.enviandoSolicitacao = false;
      }
    });
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

  proximaFoto(): void {
    if (this.imovel && this.imovel.fotos) {
      this.fotoAtual = (this.fotoAtual + 1) % this.imovel.fotos.length;
    }
  }

  fotoAnterior(): void {
    if (this.imovel && this.imovel.fotos) {
      this.fotoAtual = (this.fotoAtual - 1 + this.imovel.fotos.length) % this.imovel.fotos.length;
    }
  }

  selecionarFoto(index: number): void {
    this.fotoAtual = index;
  }
}