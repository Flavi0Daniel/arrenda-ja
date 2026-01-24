export interface Mensagem {
  id: number;
  remetenteId: number;
  destinatarioId: number;
  imovelId?: number;
  assunto?: string;
  conteudo: string;
  foiLida: boolean;
  dataEnvio: Date;
  
  // Campos extras do JOIN
  remetenteNome?: string;
  destinatarioNome?: string;
  remetenteFoto?: string;
  destinatarioFoto?: string;
  imovelTitulo?: string;
}

export interface EnviarMensagem {
  destinatarioId: number;
  imovelId?: number;
  assunto?: string;
  conteudo: string;
}