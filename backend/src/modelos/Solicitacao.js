/**
 * Classe que representa uma solicitação de arrendamento
 */
class Solicitacao {
    constructor(dados) {
        this.id = dados.id;
        this.imovelId = dados.imovel_id;
        this.arrendatarioId = dados.arrendatario_id;
        this.mensagemInicial = dados.mensagem_inicial;
        this.status = dados.status;
        this.dataSolicitacao = dados.data_solicitacao;
        this.dataResposta = dados.data_resposta;
        this.observacoes = dados.observacoes;
        
        // Campos extras quando há JOIN
        this.imovelTitulo = dados.imovel_titulo;
        this.imovelPreco = dados.imovel_preco;
        this.arrendatarioNome = dados.arrendatario_nome;
        this.arrendatarioEmail = dados.arrendatario_email;
        this.arrendatarioTelefone = dados.arrendatario_telefone;
        this.proprietarioNome = dados.proprietario_nome;
        this.proprietarioTelefone = dados.proprietario_telefone;
        this.proprietarioId = dados.proprietario_id;
    }

    /**
     * Verifica se a solicitação está pendente
     */
    estaPendente() {
        return this.status === 'pendente';
    }

    /**
     * Verifica se a solicitação foi aceite
     */
    foiAceite() {
        return this.status === 'aceite';
    }

    /**
     * Verifica se a solicitação foi recusada
     */
    foiRecusada() {
        return this.status === 'recusada';
    }

    /**
     * Verifica se a solicitação foi cancelada
     */
    foiCancelada() {
        return this.status === 'cancelada';
    }

    /**
     * Retorna a cor do badge baseado no status
     */
    obterCorStatus() {
        const cores = {
            'pendente': 'warning',
            'aceite': 'success',
            'recusada': 'danger',
            'cancelada': 'secondary'
        };
        return cores[this.status] || 'secondary';
    }

    /**
     * Retorna o texto do status em português
     */
    obterTextoStatus() {
        const textos = {
            'pendente': 'Pendente',
            'aceite': 'Aceite',
            'recusada': 'Recusada',
            'cancelada': 'Cancelada'
        };
        return textos[this.status] || this.status;
    }
}

module.exports = Solicitacao;