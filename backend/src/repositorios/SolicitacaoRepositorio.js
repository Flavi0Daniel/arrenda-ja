const bd = require('../configuracao/baseDados');

/**
 * Repositório para gestão de solicitações de arrendamento
 */
class SolicitacaoRepositorio {
    /**
     * Criar nova solicitação
     */
    async criar(dadosSolicitacao) {
        const [resultado] = await bd.execute(`
            INSERT INTO solicitacoes_arrendamento 
            (imovel_id, arrendatario_id, mensagem_inicial, status)
            VALUES (?, ?, ?, 'pendente')
        `, [
            dadosSolicitacao.imovelId,
            dadosSolicitacao.arrendatarioId,
            dadosSolicitacao.mensagemInicial
        ]);

        return this.buscarPorId(resultado.insertId);
    }

    /**
     * Buscar solicitação por ID
     */
    async buscarPorId(id) {
        const [linhas] = await bd.execute(`
            SELECT 
                s.*,
                i.titulo as imovel_titulo,
                i.preco_mensal as imovel_preco,
                arr.nome_completo as arrendatario_nome,
                arr.email as arrendatario_email,
                arr.telefone as arrendatario_telefone,
                prop.nome_completo as proprietario_nome,
                prop.id as proprietario_id
            FROM solicitacoes_arrendamento s
            INNER JOIN imoveis i ON s.imovel_id = i.id
            INNER JOIN utilizadores arr ON s.arrendatario_id = arr.id
            INNER JOIN utilizadores prop ON i.proprietario_id = prop.id
            WHERE s.id = ?
        `, [id]);

        return linhas.length > 0 ? linhas[0] : null;
    }

    /**
     * Listar solicitações recebidas pelo proprietário
     */
    async listarPorProprietario(proprietarioId, status = null) {
        let query = `
            SELECT 
                s.*,
                i.titulo as imovel_titulo,
                i.preco_mensal as imovel_preco,
                arr.nome_completo as arrendatario_nome,
                arr.email as arrendatario_email,
                arr.telefone as arrendatario_telefone
            FROM solicitacoes_arrendamento s
            INNER JOIN imoveis i ON s.imovel_id = i.id
            INNER JOIN utilizadores arr ON s.arrendatario_id = arr.id
            WHERE i.proprietario_id = ?
        `;

        const parametros = [proprietarioId];

        if (status) {
            query += ' AND s.status = ?';
            parametros.push(status);
        }

        query += ' ORDER BY s.data_solicitacao DESC';

        const [linhas] = await bd.execute(query, parametros);
        return linhas;
    }

    /**
     * Listar solicitações enviadas pelo arrendatário
     */
    async listarPorArrendatario(arrendatarioId) {
        const [linhas] = await bd.execute(`
            SELECT 
                s.*,
                i.titulo as imovel_titulo,
                i.preco_mensal as imovel_preco,
                prop.nome_completo as proprietario_nome,
                prop.telefone as proprietario_telefone
            FROM solicitacoes_arrendamento s
            INNER JOIN imoveis i ON s.imovel_id = i.id
            INNER JOIN utilizadores prop ON i.proprietario_id = prop.id
            WHERE s.arrendatario_id = ?
            ORDER BY s.data_solicitacao DESC
        `, [arrendatarioId]);

        return linhas;
    }

    /**
     * Verificar se já existe solicitação do arrendatário para o imóvel
     */
    async verificarSolicitacaoExistente(imovelId, arrendatarioId) {
        const [linhas] = await bd.execute(`
            SELECT * FROM solicitacoes_arrendamento 
            WHERE imovel_id = ? AND arrendatario_id = ? 
            AND status IN ('pendente', 'aceite')
        `, [imovelId, arrendatarioId]);

        return linhas.length > 0;
    }

    /**
     * Atualizar status da solicitação
     */
    async atualizarStatus(id, novoStatus, observacoes = null) {
        await bd.execute(`
            UPDATE solicitacoes_arrendamento 
            SET status = ?, data_resposta = NOW(), observacoes = ?
            WHERE id = ?
        `, [novoStatus, observacoes, id]);

        return this.buscarPorId(id);
    }

    /**
     * Contar solicitações pendentes do proprietário
     */
    async contarPendentes(proprietarioId) {
        const [linhas] = await bd.execute(`
            SELECT COUNT(*) as total 
            FROM solicitacoes_arrendamento s
            INNER JOIN imoveis i ON s.imovel_id = i.id
            WHERE i.proprietario_id = ? AND s.status = 'pendente'
        `, [proprietarioId]);

        return linhas[0].total;
    }
}

module.exports = new SolicitacaoRepositorio();