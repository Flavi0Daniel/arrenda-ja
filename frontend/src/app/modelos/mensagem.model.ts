export interface Mensagem {
  id: number;
  remetenteId: number;
  destinatarioId: number;
  imovelId?: number;
  assunto?: string;
  conteudo: string;
  foiLida: boolean;
  dataEnvio: Date;

  // Adicionar campos snake_case também:
  remetente_id: number;      // ← ADICIONAR
  destinatario_id: number;   // ← ADICIONAR
  imovel_id?: number;        // ← ADICIONAR
  foi_lida: boolean;         // ← ADICIONAR
  data_envio: Date;          // ← ADICIONAR

  
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