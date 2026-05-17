export interface Imovel {
  id: number;
  proprietarioId: number;
  condominioId: number;
  titulo: string;
  descricao: string;
  tipologia: 'T0' | 'T1' | 'T2' | 'T3' | 'T4' | 'T5+';
  precoMensal: number;
  areaMetrosQuadrados?: number;
  numeroQuartos?: number;
  numeroCasasBanho?: number;
  temGaragem: boolean;
  temPiscina: boolean;
  estaMobilado: boolean;
  status: 'disponivel' | 'arrendado' | 'em_analise' | 'inativo';
  dataDisponibilidade?: Date;
  dataCriacao: Date;
  dataAtualizacao: Date;
  
  // Campos extras do JOIN
  proprietario?: {
    nome: string;
    email: string;
    telefone: string;
  };
  condominio?: {
    nome: string;
    provincia: string;
    municipio: string;
    bairro: string;
    descricao?: string;
  };
  fotos?: FotoImovel[];
  fotoPrincipal?: string;
  foto_principal?: string;
  totalVisualizacoes?: number;
}

export interface FotoImovel {
  id: number;
  imovelId: number;
  caminho_arquivo: string;
  ePrincipal: boolean;
  ordemExibicao: number;
}

export interface FiltrosPesquisa {
  tipologia?: string;
  precoMinimo?: number;
  precoMaximo?: number;
  provincia?: string;
  municipio?: string;
  bairro?: string;
  temGaragem?: boolean;
  temPiscina?: boolean;
  estaMobilado?: boolean;
  pagina?: number;
  itensPorPagina?: number;
}