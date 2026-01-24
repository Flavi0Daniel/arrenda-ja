const bd = require('../configuracao/baseDados');
const Utilizador = require('../modelos/Utilizador');

/**
 * Repositório responsável por todas as operações
 * de utilizadores na base de dados
 */
class UtilizadorRepositorio {
    /**
     * Buscar utilizador por email
     */
    async buscarPorEmail(email) {
        const [linhas] = await bd.execute(
            'SELECT * FROM utilizadores WHERE email = ? AND esta_ativo = TRUE',
            [email]
        );
        return linhas.length > 0 ? new Utilizador(linhas[0]) : null;
    }

    /**
     * Criar novo utilizador
     */
    async criar(dadosUtilizador) {
        const [resultado] = await bd.execute(`
            INSERT INTO utilizadores 
            (nome_completo, email, senha, telefone, tipo_utilizador, foto_perfil) 
            VALUES (?, ?, ?, ?, ?, ?)
        `, [
            dadosUtilizador.nomeCompleto,
            dadosUtilizador.email,
            dadosUtilizador.senha,
            dadosUtilizador.telefone,
            dadosUtilizador.tipoUtilizador,
            dadosUtilizador.fotoPerfil
        ]);
        
        return this.buscarPorId(resultado.insertId);
    }

    /**
     * Buscar utilizador por ID
     */
    async buscarPorId(id) {
        const [linhas] = await bd.execute(
            'SELECT * FROM utilizadores WHERE id = ? AND esta_ativo = TRUE',
            [id]
        );
        return linhas.length > 0 ? new Utilizador(linhas[0]) : null;
    }

    /**
     * Atualizar dados do utilizador
     */
    async atualizar(id, dadosAtualizacao) {
        const campos = [];
        const valores = [];

        // Construir query dinamicamente baseado nos campos fornecidos
        if (dadosAtualizacao.nomeCompleto) {
            campos.push('nome_completo = ?');
            valores.push(dadosAtualizacao.nomeCompleto);
        }
        if (dadosAtualizacao.telefone) {
            campos.push('telefone = ?');
            valores.push(dadosAtualizacao.telefone);
        }
        if (dadosAtualizacao.fotoPerfil) {
            campos.push('foto_perfil = ?');
            valores.push(dadosAtualizacao.fotoPerfil);
        }

        if (campos.length === 0) {
            throw new Error('Nenhum campo para atualizar');
        }

        valores.push(id);

        await bd.execute(
            `UPDATE utilizadores SET ${campos.join(', ')} WHERE id = ?`,
            valores
        );

        return this.buscarPorId(id);
    }

    /**
     * Listar todos os utilizadores (com paginação)
     */
    async listarTodos(pagina = 1, itensPorPagina = 10, tipoUtilizador = null) {
        const deslocamento = (pagina - 1) * itensPorPagina;
        
        let query = 'SELECT * FROM utilizadores WHERE esta_ativo = TRUE';
        const parametros = [];

        if (tipoUtilizador) {
            query += ' AND tipo_utilizador = ?';
            parametros.push(tipoUtilizador);
        }

        query += ' ORDER BY data_criacao DESC LIMIT ? OFFSET ?';
        parametros.push(itensPorPagina, deslocamento);

        const [linhas] = await bd.execute(query, parametros);
        return linhas.map(linha => new Utilizador(linha));
    }

    /**
     * Contar total de utilizadores
     */
    async contarTotal(tipoUtilizador = null) {
        let query = 'SELECT COUNT(*) as total FROM utilizadores WHERE esta_ativo = TRUE';
        const parametros = [];

        if (tipoUtilizador) {
            query += ' AND tipo_utilizador = ?';
            parametros.push(tipoUtilizador);
        }

        const [linhas] = await bd.execute(query, parametros);
        return linhas[0].total;
    }

    /**
     * Desativar utilizador (soft delete)
     */
    async desativar(id) {
        await bd.execute(
            'UPDATE utilizadores SET esta_ativo = FALSE WHERE id = ?',
            [id]
        );
    }
}

module.exports = new UtilizadorRepositorio();