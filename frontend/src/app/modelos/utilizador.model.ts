export interface Utilizador {
  id: number;
  nomeCompleto: string;
  email: string;
  telefone?: string;
  tipoUtilizador: 'proprietario' | 'arrendatario' | 'administrador';
  fotoPerfil?: string;
  estaAtivo: boolean;
  dataCriacao: Date;
  dataAtualizacao: Date;
}

export interface RespostaAutenticacao {
  sucesso: boolean;
  mensagem?: string;
  dados: {
    utilizador: Utilizador;
    token: string;
  };
}

export interface DadosRegistro {
  nomeCompleto: string;
  email: string;
  senha: string;
  telefone?: string;
  tipoUtilizador: 'proprietario' | 'arrendatario';
}

export interface DadosLogin {
  email: string;
  senha: string;
}