/**
 * Classe que representa um imóvel no sistema
 */
class Imovel {
    constructor(dados) {
        this.id = dados.id;
        this.proprietarioId = dados.proprietario_id;
        this.condominioId = dados.condominio_id;
        this.titulo = dados.titulo;
        this.descricao = dados.descricao;
        this.tipologia = dados.tipologia;
        this.precoMensal = dados.preco_mensal;
        this.areaMetrosQuadrados = dados.area_metros_quadrados;
        this.numeroQuartos = dados.numero_quartos;
        this.numeroCasasBanho = dados.numero_casas_banho;
        this.temGaragem = dados.tem_garagem;
        this.temPiscina = dados.tem_piscina;
        this.estaMobilado = dados.esta_mobilado;
        this.status = dados.status || 'em_analise';
        this.dataDisponibilidade = dados.data_disponibilidade;
        this.dataCriacao = dados.data_criacao;
        this.dataAtualizacao = dados.data_atualizacao;
    }

    /**
     * Verifica se o imóvel está disponível para arrendamento
     */
    estaDisponivel() {
        return this.status === 'disponivel';
    }

    /**
     * Verifica se o imóvel já foi arrendado
     */
    estaArrendado() {
        return this.status === 'arrendado';
    }
}

module.exports = Imovel;