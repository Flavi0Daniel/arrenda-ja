import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ImovelService } from '../../../servicos/imovel.service';
import { CondominioService } from '../../../servicos/condominio.service';
import { AutenticacaoService } from '../../../servicos/autenticacao.service';
import { Condominio } from '../../../modelos/condominio.model';

@Component({
  selector: 'app-criar-imovel',
  templateUrl: './criar-imovel.component.html',
  styleUrls: ['./criar-imovel.component.css']
})
export class CriarImovelComponent implements OnInit {
  formulario!: FormGroup;
  carregando = false;
  erro: string | null = null;
  sucesso = false;
  
  // Dados para selects
  condominios: Condominio[] = [];
  provincias: string[] = [];
  municipios: string[] = [];
  tipologias = ['T0', 'T1', 'T2', 'T3', 'T4', 'T5+'];
  
  // Upload de fotos
  fotosSelecionadas: File[] = [];
  previewFotos: string[] = [];
  
  // Controle de passos
  passoAtual = 1;
  totalPassos = 3;

  constructor(
    private formBuilder: FormBuilder,
    private imovelService: ImovelService,
    private condominioService: CondominioService,
    private autenticacaoService: AutenticacaoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Verificar se é proprietário
    if (!this.autenticacaoService.eProprietario()) {
      alert('Apenas proprietários podem publicar imóveis');
      this.router.navigate(['/']);
      return;
    }

    this.criarFormulario();
    this.carregarCondominios();
    this.carregarProvincias();
  }

  criarFormulario(): void {
    this.formulario = this.formBuilder.group({
      // Passo 1 - Informações Básicas
      titulo: ['', [Validators.required, Validators.minLength(10)]],
      descricao: ['', [Validators.required, Validators.minLength(50)]],
      tipologia: ['', Validators.required],
      condominioId: ['', Validators.required],
      
      // Passo 2 - Detalhes
      precoMensal: ['', [Validators.required, Validators.min(1)]],
      areaMetrosQuadrados: [''],
      numeroQuartos: [''],
      numeroCasasBanho: [''],
      
      // Passo 3 - Características
      temGaragem: [false],
      temPiscina: [false],
      estaMobilado: [false],
      dataDisponibilidade: ['']
    });
  }

  carregarCondominios(): void {
    this.condominioService.listarTodos().subscribe({
      next: (resposta) => {
        if (resposta.sucesso && resposta.dados) {
          this.condominios = resposta.dados;
        }
      },
      error: (erro) => console.error('Erro ao carregar condomínios:', erro)
    });
  }

  carregarProvincias(): void {
    this.condominioService.obterProvincias().subscribe({
      next: (resposta) => {
        if (resposta.sucesso && resposta.dados) {
          this.provincias = resposta.dados;
        }
      },
      error: (erro) => console.error('Erro ao carregar províncias:', erro)
    });
  }

  carregarMunicipios(provincia: string): void {
    if (!provincia) {
      this.municipios = [];
      return;
    }

    this.condominioService.obterMunicipios(provincia).subscribe({
      next: (resposta) => {
        if (resposta.sucesso && resposta.dados) {
          this.municipios = resposta.dados;
        }
      },
      error: (erro) => console.error('Erro ao carregar municípios:', erro)
    });
  }

  onFotosChange(event: any): void {
    const arquivos = event.target.files;
    
    if (arquivos.length + this.fotosSelecionadas.length > 10) {
      alert('Máximo de 10 fotos permitidas');
      return;
    }

    for (let i = 0; i < arquivos.length; i++) {
      const arquivo = arquivos[i];
      
      // Validar tipo de arquivo
      if (!arquivo.type.match(/image\/(jpeg|jpg|png|webp)/)) {
        alert('Apenas imagens JPG, PNG ou WEBP são permitidas');
        continue;
      }

      // Validar tamanho (5MB)
      if (arquivo.size > 5 * 1024 * 1024) {
        alert('Cada imagem deve ter no máximo 5MB');
        continue;
      }

      this.fotosSelecionadas.push(arquivo);

      // Criar preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewFotos.push(e.target.result);
      };
      reader.readAsDataURL(arquivo);
    }
  }

  removerFoto(index: number): void {
    this.fotosSelecionadas.splice(index, 1);
    this.previewFotos.splice(index, 1);
  }

  proximoPasso(): void {
    if (this.passoAtual < this.totalPassos) {
      this.passoAtual++;
    }
  }

  passoAnterior(): void {
    if (this.passoAtual > 1) {
      this.passoAtual--;
    }
  }

  publicar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    if (this.fotosSelecionadas.length === 0) {
      alert('Adicione pelo menos 1 foto do imóvel');
      return;
    }

    this.carregando = true;
    this.erro = null;

    // Criar imóvel
    this.imovelService.criar(this.formulario.value).subscribe({
      next: (resposta) => {
        if (resposta.sucesso && resposta.dados) {
          const imovelId = resposta.dados.id;

          // Fazer upload das fotos
          this.imovelService.adicionarFotos(imovelId, this.fotosSelecionadas).subscribe({
            next: () => {
              this.sucesso = true;
              setTimeout(() => {
                this.router.navigate(['/proprietario/meus-imoveis']);
              }, 2000);
            },
            error: (erro) => {
              this.erro = 'Imóvel criado, mas erro ao enviar fotos. Você pode adicioná-las depois.';
              this.carregando = false;
              setTimeout(() => {
                this.router.navigate(['/proprietario/meus-imoveis']);
              }, 3000);
            }
          });
        }
      },
      error: (erro) => {
        this.erro = erro.message || 'Erro ao publicar imóvel. Tente novamente.';
        this.carregando = false;
      }
    });
  }

  // Getters para facilitar acesso aos campos
  get titulo() { return this.formulario.get('titulo'); }
  get descricao() { return this.formulario.get('descricao'); }
  get tipologia() { return this.formulario.get('tipologia'); }
  get condominioId() { return this.formulario.get('condominioId'); }
  get precoMensal() { return this.formulario.get('precoMensal'); }
}