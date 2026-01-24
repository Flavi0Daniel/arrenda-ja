/**
 * Classe que representa um condomínio
 */
class Condominio {
    constructor(dados) {
        this.id = dados.id;
        this.nome = dados.nome;
        this.provincia = dados.provincia;
        this.municipio = dados.municipio;
        this.bairro = dados.bairro;
        this.enderecoCompleto = dados.endereco_completo;
        this.descricao = dados.descricao;
        this.dataCriacao = dados.data_criacao;
    }

    /**
     * Retorna endereço formatado
     */
    obterEnderecoCompleto() {
        return `${this.nome}, ${this.bairro}, ${this.municipio} - ${this.provincia}`;
    }

    /**
     * Verifica se o condomínio está em Luanda
     */
    eEmLuanda() {
        return this.provincia.toLowerCase() === 'luanda';
    }
}

module.exports = Condominio;