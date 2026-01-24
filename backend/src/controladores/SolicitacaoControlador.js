const SolicitacaoServico = require('../servicos/SolicitacaoServico');

/**
 * Controlador para gestão de solicitações de arrendamento
 */
class SolicitacaoControlador {
    /**
     * POST /api/solicitacoes
     * Criar nova solicitação
     */
    async criar(req, res) {
        try {
            const arrendatarioId = req.utilizador.id;
            const novaSolicitacao = await SolicitacaoServico.criar(req.body, arrendatarioId);
            
            res.status(201).json({
                sucesso: true,
                mensagem: 'Solicitação enviada com sucesso',
                dados: novaSolicitacao
            });
        } catch (erro) {
            res.status(400).json({
                sucesso: false,
                mensagem: erro.message
            });
        }
    }

    /**
     * GET /api/solicitacoes/recebidas
     * Listar solicitações recebidas (proprietário)
     */
    async listarRecebidas(req, res) {
        try {
            const proprietarioId = req.utilizador.id;
            const status = req.query.status || null;
            
            const solicitacoes = await SolicitacaoServico.listarRecebidas(proprietarioId, status);
            
            res.json({
                sucesso: true,
                dados: solicitacoes
            });
        } catch (erro) {
            res.status(400).json({
                sucesso: false,
                mensagem: erro.message
            });
        }
    }

    /**
     * GET /api/solicitacoes/enviadas
     * Listar solicitações enviadas (arrendatário)
     */
    async listarEnviadas(req, res) {
        try {
            const arrendatarioId = req.utilizador.id;
            const solicitacoes = await SolicitacaoServico.listarEnviadas(arrendatarioId);
            
            res.json({
                sucesso: true,
                dados: solicitacoes
            });
        } catch (erro) {
            res.status(400).json({
                sucesso: false,
                mensagem: erro.message
            });
        }
    }

    /**
     * PATCH /api/solicitacoes/:id/responder
     * Responder a uma solicitação (aceitar/recusar)
     */
    async responder(req, res) {
        try {
            const solicitacaoId = parseInt(req.params.id);
            const proprietarioId = req.utilizador.id;
            const { aceitar, observacoes } = req.body;

            const solicitacao = await SolicitacaoServico.responder(
                solicitacaoId,
                proprietarioId,
                aceitar,
                observacoes
            );
            
            res.json({
                sucesso: true,
                mensagem: aceitar ? 'Solicitação aceite' : 'Solicitação recusada',
                dados: solicitacao
            });
        } catch (erro) {
            res.status(400).json({
                sucesso: false,
                mensagem: erro.message
            });
        }
    }

    /**
     * PATCH /api/solicitacoes/:id/cancelar
     * Cancelar solicitação (arrendatário)
     */
    async cancelar(req, res) {
        try {
            const solicitacaoId = parseInt(req.params.id);
            const arrendatarioId = req.utilizador.id;

            const solicitacao = await SolicitacaoServico.cancelar(solicitacaoId, arrendatarioId);
            
            res.json({
                sucesso: true,
                mensagem: 'Solicitação cancelada',
                dados: solicitacao
            });
        } catch (erro) {
            res.status(400).json({
                sucesso: false,
                mensagem: erro.message
            });
        }
    }

    /**
     * GET /api/solicitacoes/pendentes/contar
     * Contar solicitações pendentes
     */
    async contarPendentes(req, res) {
        try {
            const proprietarioId = req.utilizador.id;
            const total = await SolicitacaoServico.contarPendentes(proprietarioId);
            
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
}

module.exports = new SolicitacaoControlador();