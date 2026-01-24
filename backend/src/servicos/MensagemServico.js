const MensagemRepositorio = require('../repositorios/MensagemRepositorio');
const UtilizadorRepositorio = require('../repositorios/UtilizadorRepositorio');

/**
 * Serviço para gestão de mensagens
 */
class MensagemServico {
    /**
     * Enviar mensagem
     */
    async criar(dadosMensagem) {
        // Verificar se remetente existe
        const remetente = await UtilizadorRepositorio.buscarPorId(dadosMensagem.remetenteId);
        if (!remetente) {
            throw new Error('Remetente não encontrado');
        }

        // Verificar se destinatário existe
        const destinatario = await UtilizadorRepositorio.buscarPorId(dadosMensagem.destinatarioId);
        if (!destinatario) {
            throw new Error('Destinatário não encontrado');
        }

        // Validar conteúdo
        if (!dadosMensagem.conteudo || dadosMensagem.conteudo.trim().length < 1) {
            throw new Error('A mensagem não pode estar vazia');
        }

        return await MensagemRepositorio.criar(dadosMensagem);
    }

    /**
     * Listar mensagens recebidas
     */
    async listarRecebidas(utilizadorId, apenasnaoLidas = false) {
        return await MensagemRepositorio.listarRecebidas(utilizadorId, apenasnaoLidas);
    }

    /**
     * Listar mensagens enviadas
     */
    async listarEnviadas(utilizadorId) {
        return await MensagemRepositorio.listarEnviadas(utilizadorId);
    }

    /**
     * Ler mensagem
     */
    async ler(mensagemId, utilizadorId) {
        const mensagem = await MensagemRepositorio.buscarPorId(mensagemId);
        
        if (!mensagem) {
            throw new Error('Mensagem não encontrada');
        }

        // Apenas o destinatário pode marcar como lida
        if (mensagem.destinatario_id !== utilizadorId) {
            throw new Error('Você não tem permissão para acessar esta mensagem');
        }

        await MensagemRepositorio.marcarComoLida(mensagemId);
        
        return mensagem;
    }

    /**
     * Contar mensagens não lidas
     */
    async contarNaoLidas(utilizadorId) {
        return await MensagemRepositorio.contarNaoLidas(utilizadorId);
    }

    /**
     * Obter conversa com outro utilizador
     */
    async obterConversa(utilizadorId, outroUtilizadorId, imovelId = null) {
        return await MensagemRepositorio.buscarConversa(utilizadorId, outroUtilizadorId, imovelId);
    }
}

module.exports = new MensagemServico();