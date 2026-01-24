export interface Condominio {
  id: number;
  nome: string;
  provincia: string;
  municipio: string;
  bairro: string;
  enderecoCompleto?: string;
  descricao?: string;
  dataCriacao: Date;
}