const bd = require('../configuracao/baseDados');

/**
 * Repositório para gestão de mensagens
 */
class MensagemRepositorio {
    /**
     * Criar nova mensagem
     */
    async criar(dadosMensagem) {
        const [resultado] = await bd.execute(`
            INSERT INTO mensagens 
            (remetente_id, destinatario_id, imovel_id, assunto, conteudo)
            VALUES (?, ?, ?, ?, ?)
        `, [
            dadosMensagem.remetenteId,
            dadosMensagem.destinatarioId,
            dadosMensagem.imovelId,
            dadosMensagem.assunto,
            dadosMensagem.conteudo
        ]);

        return this.buscarPorId(resultado.insertId);
    }

    /**
     * Buscar mensagem por ID
     */
    async buscarPorId(id) {
        const [linhas] = await bd.execute(`
            SELECT 
                m.*,
                rem.nome_completo as remetente_nome,
                dest.nome_completo as destinatario_nome
            FROM mensagens m
            INNER JOIN utilizadores rem ON m.remetente_id = rem.id
            INNER JOIN utilizadores dest ON m.destinatario_id = dest.id
            WHERE m.id = ?
        `, [id]);

        return linhas.length > 0 ? linhas[0] : null;
    }

    /**
     * Listar mensagens recebidas
     */
    async listarRecebidas(utilizadorId, apenasnaoLidas = false) {
        let query = `
            SELECT 
                m.*,
                rem.nome_completo as remetente_nome,
                rem.foto_perfil as remetente_foto,
                i.titulo as imovel_titulo
            FROM mensagens m
            INNER JOIN utilizadores rem ON m.remetente_id = rem.id
            LEFT JOIN imoveis i ON m.imovel_id = i.id
            WHERE m.destinatario_id = ?
        `;

        if (apenasnaoLidas) {
            query += ' AND m.foi_lida = FALSE';
        }

        query += ' ORDER BY m.data_envio DESC';

        const [linhas] = await bd.execute(query, [utilizadorId]);
        return linhas;
    }

    /**
     * Listar mensagens enviadas
     */
    async listarEnviadas(utilizadorId) {
        const [linhas] = await bd.execute(`
            SELECT 
                m.*,
                dest.nome_completo as destinatario_nome,
                dest.foto_perfil as destinatario_foto,
                i.titulo as imovel_titulo
            FROM mensagens m
            INNER JOIN utilizadores dest ON m.destinatario_id = dest.id
            LEFT JOIN imoveis i ON m.imovel_id = i.id
            WHERE m.remetente_id = ?
            ORDER BY m.data_envio DESC
        `, [utilizadorId]);

        return linhas;
    }

    /**
     * Marcar mensagem como lida
     */
    async marcarComoLida(id) {
        await bd.execute(
            'UPDATE mensagens SET foi_lida = TRUE WHERE id = ?',
            [id]
        );
    }

    /**
     * Contar mensagens não lidas
     */
    async contarNaoLidas(utilizadorId) {
        const [linhas] = await bd.execute(
            'SELECT COUNT(*) as total FROM mensagens WHERE destinatario_id = ? AND foi_lida = FALSE',
            [utilizadorId]
        );

        return linhas[0].total;
    }

    /**
     * Buscar conversa entre dois utilizadores sobre um imóvel
     */
    async buscarConversa(utilizador1Id, utilizador2Id, imovelId = null) {
        let query = `
            SELECT 
                m.*,
                rem.nome_completo as remetente_nome
            FROM mensagens m
            INNER JOIN utilizadores rem ON m.remetente_id = rem.id
            WHERE (
                (m.remetente_id = ? AND m.destinatario_id = ?) OR
                (m.remetente_id = ? AND m.destinatario_id = ?)
            )
        `;

        const parametros = [utilizador1Id, utilizador2Id, utilizador2Id, utilizador1Id];

        if (imovelId) {
            query += ' AND m.imovel_id = ?';
            parametros.push(imovelId);
        }

        query += ' ORDER BY m.data_envio ASC';

        const [linhas] = await bd.execute(query, parametros);
        return linhas;
    }
}

module.exports = new MensagemRepositorio();