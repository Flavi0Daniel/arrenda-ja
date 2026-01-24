const SolicitacaoRepositorio = require('../repositorios/SolicitacaoRepositorio');
const ImovelRepositorio = require('../repositorios/ImovelRepositorio');
const UtilizadorRepositorio = require('../repositorios/UtilizadorRepositorio');
const MensagemServico = require('./MensagemServico');

/**
 * Serviço para gestão de solicitações de arrendamento
 */
class SolicitacaoServico {
    /**
     * Criar nova solicitação
     */
    async criar(dadosSolicitacao, arrendatarioId) {
        // Verificar se o utilizador é arrendatário
        const arrendatario = await UtilizadorRepositorio.buscarPorId(arrendatarioId);
        
        if (!arrendatario || !arrendatario.eArrendatario()) {
            throw new Error('Apenas arrendatários podem enviar solicitações');
        }

        // Verificar se o imóvel existe e está disponível
        const imovel = await ImovelRepositorio.buscarPorId(dadosSolicitacao.imovelId);
        
        if (!imovel) {
            throw new Error('Imóvel não encontrado');
        }

        if (!imovel.estaDisponivel()) {
            throw new Error('Este imóvel não está disponível para arrendamento');
        }

        // Verificar se já existe solicitação
        const jaExisteSolicitacao = await SolicitacaoRepositorio.verificarSolicitacaoExistente(
            dadosSolicitacao.imovelId,
            arrendatarioId
        );

        if (jaExisteSolicitacao) {
            throw new Error('Você já enviou uma solicitação para este imóvel');
        }

        // Criar solicitação
        const novaSolicitacao = await SolicitacaoRepositorio.criar({
            imovelId: dadosSolicitacao.imovelId,
            arrendatarioId,
            mensagemInicial: dadosSolicitacao.mensagem
        });

        // Enviar mensagem automática ao proprietário
        await MensagemServico.criar({
            remetenteId: arrendatarioId,
            destinatarioId: imovel.proprietarioId,
            imovelId: imovel.id,
            assunto: `Nova solicitação para ${imovel.titulo}`,
            conteudo: dadosSolicitacao.mensagem || 'Tenho interesse em arrendar este imóvel.'
        });

        return novaSolicitacao;
    }

    /**
     * Responder a uma solicitação (aceitar ou recusar)
     */
    async responder(solicitacaoId, proprietarioId, aceitar, observacoes = null) {
        // Buscar solicitação
        const solicitacao = await SolicitacaoRepositorio.buscarPorId(solicitacaoId);
        
        if (!solicitacao) {
            throw new Error('Solicitação não encontrada');
        }

        // Verificar se é o proprietário
        if (solicitacao.proprietario_id !== proprietarioId) {
            throw new Error('Você não tem permissão para responder a esta solicitação');
        }

        // Verificar se já foi respondida
        if (solicitacao.status !== 'pendente') {
            throw new Error('Esta solicitação já foi respondida');
        }

        // Atualizar status
        const novoStatus = aceitar ? 'aceite' : 'recusada';
        const solicitacaoAtualizada = await SolicitacaoRepositorio.atualizarStatus(
            solicitacaoId,
            novoStatus,
            observacoes
        );

        // Enviar mensagem ao arrendatário
        const mensagemResposta = aceitar
            ? `Boa notícia! Sua solicitação foi aceita. ${observacoes || ''}`
            : `Sua solicitação foi recusada. ${observacoes || ''}`;

        await MensagemServico.criar({
            remetenteId: proprietarioId,
            destinatarioId: solicitacao.arrendatario_id,
            imovelId: solicitacao.imovel_id,
            assunto: `Resposta à sua solicitação - ${solicitacao.imovel_titulo}`,
            conteudo: mensagemResposta
        });

        return solicitacaoAtualizada;
    }

    /**
     * Listar solicitações recebidas (proprietário)
     */
    async listarRecebidas(proprietarioId, status = null) {
        return await SolicitacaoRepositorio.listarPorProprietario(proprietarioId, status);
    }

    /**
     * Listar solicitações enviadas (arrendatário)
     */
    async listarEnviadas(arrendatarioId) {
        return await SolicitacaoRepositorio.listarPorArrendatario(arrendatarioId);
    }

    /**
     * Cancelar solicitação (arrendatário)
     */
    async cancelar(solicitacaoId, arrendatarioId) {
        const solicitacao = await SolicitacaoRepositorio.buscarPorId(solicitacaoId);
        
        if (!solicitacao) {
            throw new Error('Solicitação não encontrada');
        }

        if (solicitacao.arrendatario_id !== arrendatarioId) {
            throw new Error('Você não tem permissão para cancelar esta solicitação');
        }

        if (solicitacao.status !== 'pendente') {
            throw new Error('Apenas solicitações pendentes podem ser canceladas');
        }

        return await SolicitacaoRepositorio.atualizarStatus(solicitacaoId, 'cancelada');
    }

    /**
     * Contar solicitações pendentes
     */
    async contarPendentes(proprietarioId) {
        return await SolicitacaoRepositorio.contarPendentes(proprietarioId);
    }
}

module.exports = new SolicitacaoServico();