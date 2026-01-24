const MensagemServico = require('../servicos/MensagemServico');

/**
 * Controlador para gestão de mensagens
 */
class MensagemControlador {
    /**
     * POST /api/mensagens
     * Enviar mensagem
     */
    async enviar(req, res) {
        try {
            const remetenteId = req.utilizador.id;
            
            const novaMensagem = await MensagemServico.criar({
                remetenteId,
                destinatarioId: req.body.destinatarioId,
                imovelId: req.body.imovelId,
                assunto: req.body.assunto,
                conteudo: req.body.conteudo
            });
            
            res.status(201).json({
                sucesso: true,
                mensagem: 'Mensagem enviada com sucesso',
                dados: novaMensagem
            });
        } catch (erro) {
            res.status(400).json({
                sucesso: false,
                mensagem: erro.message
            });
        }
    }

    /**
     * GET /api/mensagens/recebidas
     * Listar mensagens recebidas
     */
    async listarRecebidas(req, res) {
        try {
            const utilizadorId = req.utilizador.id;
            const apenasnaoLidas = req.query.naoLidas === 'true';
            
            const mensagens = await MensagemServico.listarRecebidas(utilizadorId, apenasnaoLidas);
            
            res.json({
                sucesso: true,
                dados: mensagens
            });
        } catch (erro) {
            res.status(400).json({
                sucesso: false,
                mensagem: erro.message
            });
        }
    }

    /**
     * GET /api/mensagens/enviadas
     * Listar mensagens enviadas
     */
    async listarEnviadas(req, res) {
        try {
            const utilizadorId = req.utilizador.id;
            const mensagens = await MensagemServico.listarEnviadas(utilizadorId);
            
            res.json({
                sucesso: true,
                dados: mensagens
            });
        } catch (erro) {
            res.status(400).json({
                sucesso: false,
                mensagem: erro.message
            });
        }
    }

    /**
     * GET /api/mensagens/:id
     * Ler mensagem específica
     */
    async ler(req, res) {
        try {
            const mensagemId = parseInt(req.params.id);
            const utilizadorId = req.utilizador.id;
            
            const mensagem = await MensagemServico.ler(mensagemId, utilizadorId);
            
            res.json({
                sucesso: true,
                dados: mensagem
            });
        } catch (erro) {
            res.status(400).json({
                sucesso: false,
                mensagem: erro.message
            });
        }
    }

    /**
     * GET /api/mensagens/nao-lidas/contar
     * Contar mensagens não lidas
     */
    async contarNaoLidas(req, res) {
        try {
            const utilizadorId = req.utilizador.id;
            const total = await MensagemServico.contarNaoLidas(utilizadorId);
            
            res.json({
                sucesso: true,
                dados: { total }
            });
        } catch (erro) {
            res.status(400).json({
                sucesso: false,
                mensagem: erro.message
            });
        }
    }

    /**
     * GET /api/mensagens/conversa/:utilizadorId
     * Obter conversa com outro utilizador
     */
    async obterConversa(req, res) {
        try {
            const utilizadorId = req.utilizador.id;
            const outroUtilizadorId = parseInt(req.params.utilizadorId);
            const imovelId = req.query.imovelId ? parseInt(req.query.imovelId) : null;
            
            const conversa = await MensagemServico.obterConversa(
                utilizadorId,
                outroUtilizadorId,
                imovelId
            );
            
            res.json({
                sucesso: true,
                dados: conversa
            });
        } catch (erro) {
            res.status(400).json({
                sucesso: false,
                mensagem: erro.message
            });
        }
    }
}

module.exports = new MensagemControlador();