export interface RespostaAPI<T> {
  sucesso: boolean;
  mensagem?: string;
  dados?: T;
  erros?: string[];
}

export interface RespostaPaginada<T> {
  sucesso: boolean;
  dados: {
    itens: T[];
    paginacao: {
      paginaAtual: number;
      itensPorPagina: number;
      totalItens: number;
      totalPaginas: number;
    };
  };
}