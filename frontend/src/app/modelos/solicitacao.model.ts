export interface Solicitacao {
  id: number;
  imovelId: number;
  arrendatarioId: number;
  mensagemInicial?: string;
  status: 'pendente' | 'aceite' | 'recusada' | 'cancelada';
  dataSolicitacao: Date;
  dataResposta?: Date;
  observacoes?: string;
  
  // Campos extras do JOIN
  imovelTitulo?: string;
  imovelPreco?: number;
  arrendatarioNome?: string;
  arrendatarioEmail?: string;
  arrendatarioTelefone?: string;
  proprietarioNome?: string;
  proprietarioTelefone?: string;
  proprietarioId?: number;
}

export interface CriarSolicitacao {
  imovelId: number;
  mensagem?: string;
}

export interface ResponderSolicitacao {
  aceitar: boolean;
  observacoes?: string;
}