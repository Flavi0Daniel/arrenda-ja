/**
 * Classe que representa uma mensagem entre utilizadores
 */
class Mensagem {
    constructor(dados) {
        this.id = dados.id;
        this.remetenteId = dados.remetente_id;
        this.destinatarioId = dados.destinatario_id;
        this.imovelId = dados.imovel_id;
        this.assunto = dados.assunto;
        this.conteudo = dados.conteudo;
        this.foiLida = dados.foi_lida;
        this.dataEnvio = dados.data_envio;
        
        // Campos extras quando há JOIN
        this.remetenteNome = dados.remetente_nome;
        this.destinatarioNome = dados.destinatario_nome;
        this.remetenteFoto = dados.remetente_foto;
        this.destinatarioFoto = dados.destinatario_foto;
        this.imovelTitulo = dados.imovel_titulo;
    }

    /**
     * Verifica se a mensagem já foi lida
     */
    estaLida() {
        return this.foiLida === true || this.foiLida === 1;
    }

    /**
     * Retorna tempo decorrido desde o envio
     */
    obterTempoDecorrido() {
        const agora = new Date();
        const envio = new Date(this.dataEnvio);
        const diferencaMs = agora - envio;
        
        const minutos = Math.floor(diferencaMs / 60000);
        const horas = Math.floor(diferencaMs / 3600000);
        const dias = Math.floor(diferencaMs / 86400000);
        
        if (minutos < 1) return 'Agora mesmo';
        if (minutos < 60) return `Há ${minutos} minuto${minutos > 1 ? 's' : ''}`;
        if (horas < 24) return `Há ${horas} hora${horas > 1 ? 's' : ''}`;
        if (dias < 7) return `Há ${dias} dia${dias > 1 ? 's' : ''}`;
        
        return envio.toLocaleDateString('pt-AO');
    }
}

module.exports = Mensagem;