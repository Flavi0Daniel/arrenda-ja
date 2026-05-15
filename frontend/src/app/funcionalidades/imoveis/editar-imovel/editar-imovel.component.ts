import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ImovelService } from '../../../servicos/imovel.service';
import { Imovel } from '../../../modelos/imovel.model';

@Component({
  selector: 'app-editar-imovel',
  templateUrl: './editar-imovel.component.html',
  styleUrls: ['./editar-imovel.component.css']
})
export class EditarImovelComponent implements OnInit {

  imovel: Imovel | null = null;
  imovelId!: number;
  carregando = false;
  salvando = false;
  processandoStatus = false;
  uploadandoFotos = false;
  erro: string | null = null;
  sucesso: string | null = null;
 
  // Dados para edição
  dadosEdicao = {
    titulo: '',
    descricao: '',
    tipologia: 'T2' as 'T0' | 'T1' | 'T2' | 'T3' | 'T4' | 'T5+',
    precoMensal: 0,
    areaMetrosQuadrados: 0,
    numeroQuartos: 0,
    numeroCasasBanho: 0,
    temGaragem: false,
    temPiscina: false,
    estaMobilado: false
  };
 
  tipologias = ['T0', 'T1', 'T2', 'T3', 'T4', 'T5+'];
 
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private imovelService: ImovelService
  ) {}
 
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.imovelId = +params['id'];
      this.carregarImovel();
    });
  }
 
  carregarImovel(): void {
    this.carregando = true;
    this.erro = null;
 
    this.imovelService.obterPorId(this.imovelId).subscribe({
      next: (resposta) => {
        if (resposta.sucesso && resposta.dados) {
          this.imovel = resposta.dados;
          this.preencherFormulario();
        }
        this.carregando = false;
      },
      error: (erro) => {
        this.erro = 'Erro ao carregar imóvel';
        this.carregando = false;
        console.error('Erro:', erro);
      }
    });
  }
 
  preencherFormulario(): void {
    if (!this.imovel) return;
 
    this.dadosEdicao = {
      titulo: this.imovel.titulo,
      descricao: this.imovel.descricao,
      tipologia: this.imovel.tipologia,
      precoMensal: this.imovel.precoMensal,
      areaMetrosQuadrados: this.imovel.areaMetrosQuadrados || 0,
      numeroQuartos: this.imovel.numeroQuartos || 0,
      numeroCasasBanho: this.imovel.numeroCasasBanho || 0,
      temGaragem: this.imovel.temGaragem,
      temPiscina: this.imovel.temPiscina,
      estaMobilado: this.imovel.estaMobilado
    };
  }
 
  salvarAlteracoes(): void {
    if (!this.validarFormulario()) return;
 
    this.salvando = true;
    this.erro = null;
 
    this.imovelService.atualizar(this.imovelId, this.dadosEdicao).subscribe({
      next: (resposta) => {
        if (resposta.sucesso) {
          this.sucesso = 'Imóvel atualizado com sucesso!';
          this.carregarImovel();
          setTimeout(() => this.sucesso = null, 3000);
        }
        this.salvando = false;
      },
      error: (erro) => {
        this.erro = erro.error?.mensagem || 'Erro ao atualizar imóvel';
        this.salvando = false;
      }
    });
  }
 
  validarFormulario(): boolean {
    if (!this.dadosEdicao.titulo.trim()) {
      this.erro = 'O título é obrigatório';
      return false;
    }
 
    if (!this.dadosEdicao.descricao.trim()) {
      this.erro = 'A descrição é obrigatória';
      return false;
    }
 
    if (this.dadosEdicao.precoMensal <= 0) {
      this.erro = 'O preço mensal deve ser maior que zero';
      return false;
    }
 
    return true;
  }
 
  // Gerenciamento de Status
  marcarComoArrendado(): void {
    if (!confirm('Tem certeza que deseja marcar este imóvel como arrendado?')) return;
 
    this.processandoStatus = true;
    this.erro = null;
 
    this.imovelService.marcarComoArrendado(this.imovelId).subscribe({
      next: (resposta) => {
        if (resposta.sucesso) {
          this.sucesso = 'Imóvel marcado como arrendado!';
          this.carregarImovel();
          setTimeout(() => this.sucesso = null, 3000);
        }
        this.processandoStatus = false;
      },
      error: (erro) => {
        this.erro = erro.error?.mensagem || 'Erro ao alterar status';
        this.processandoStatus = false;
      }
    });
  }
 
  marcarComoDisponivel(): void {
    if (!confirm('Tem certeza que deseja marcar este imóvel como disponível novamente?')) return;
 
    this.processandoStatus = true;
    this.erro = null;
 
    // Usa o mesmo endpoint de atualizar, mas só muda o status
    this.imovelService.alterarStatusProprietario(this.imovelId, 'disponivel').subscribe({
      next: (resposta) => {
        if (resposta.sucesso) {
          this.sucesso = 'Imóvel marcado como disponível!';
          this.carregarImovel();
          setTimeout(() => this.sucesso = null, 3000);
        }
        this.processandoStatus = false;
      },
      error: (erro) => {
        this.erro = erro.error?.mensagem || 'Erro ao alterar status';
        this.processandoStatus = false;
      }
    });
  }
 
  marcarComoInativo(): void {
    if (!confirm('Tem certeza que deseja desativar este imóvel? Ele não aparecerá mais nas buscas.')) return;
 
    this.processandoStatus = true;
    this.erro = null;
 
    this.imovelService.alterarStatusProprietario(this.imovelId, 'inativo').subscribe({
      next: (resposta) => {
        if (resposta.sucesso) {
          alert('Imóvel desativado com sucesso!');
          this.router.navigate(['/proprietario/meus-imoveis']);
        }
        this.processandoStatus = false;
      },
      error: (erro) => {
        this.erro = erro.error?.mensagem || 'Erro ao desativar imóvel';
        this.processandoStatus = false;
      }
    });
  }
 
  // Gerenciamento de Fotos
  onFotosSelecionadas(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
 
    const arquivos = Array.from(input.files);
 
    // Validar quantidade
    if (arquivos.length > 10) {
      this.erro = 'Você pode enviar no máximo 10 fotos por vez';
      return;
    }
 
    // Validar tipo e tamanho
    for (const arquivo of arquivos) {
      if (!arquivo.type.match(/image\/(jpeg|jpg|png|webp)/)) {
        this.erro = 'Apenas imagens JPEG, PNG ou WEBP são permitidas';
        return;
      }
 
      if (arquivo.size > 5 * 1024 * 1024) {
        this.erro = 'Cada imagem deve ter no máximo 5MB';
        return;
      }
    }
 
    this.uploadarFotos(arquivos);
  }
 
  uploadarFotos(arquivos: File[]): void {
    this.uploadandoFotos = true;
    this.erro = null;
 
    this.imovelService.adicionarFotos(this.imovelId, arquivos).subscribe({
      next: (resposta) => {
        if (resposta.sucesso) {
          this.sucesso = `${arquivos.length} foto(s) adicionada(s) com sucesso!`;
          this.carregarImovel();
          setTimeout(() => this.sucesso = null, 3000);
        }
        this.uploadandoFotos = false;
      },
      error: (erro) => {
        this.erro = erro.error?.mensagem || 'Erro ao enviar fotos';
        this.uploadandoFotos = false;
      }
    });
  }
 
  removerFoto(fotoId: number): void {
    if (!confirm('Tem certeza que deseja remover esta foto?')) return;
 
    this.imovelService.removerFoto(this.imovelId, fotoId).subscribe({
      next: (resposta) => {
        if (resposta.sucesso) {
          this.sucesso = 'Foto removida com sucesso!';
          this.carregarImovel();
          setTimeout(() => this.sucesso = null, 3000);
        }
      },
      error: (erro) => {
        this.erro = erro.error?.mensagem || 'Erro ao remover foto';
      }
    });
  }
 
  voltar(): void {
    this.router.navigate(['/proprietario/meus-imoveis']);
  }
 
  obterUrlFoto(caminho: string): string {
    return this.imovelService.obterUrlFoto(caminho);
  }
 
  obterCorStatus(): string {
    const cores: { [key: string]: string } = {
      'disponivel': 'success',
      'arrendado': 'danger',
      'em_analise': 'warning',
      'inativo': 'secondary'
    };
    return cores[this.imovel?.status || ''] || 'secondary';
  }
 
  obterTextoStatus(): string {
    const textos: { [key: string]: string } = {
      'disponivel': 'Disponível',
      'arrendado': 'Arrendado',
      'em_analise': 'Em Análise',
      'inativo': 'Inativo'
    };
    return textos[this.imovel?.status || ''] || '';
  }

}
