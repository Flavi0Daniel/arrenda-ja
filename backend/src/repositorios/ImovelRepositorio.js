const bd = require('../configuracao/baseDados');
const Imovel = require('../modelos/Imovel');

/**
 * Repositório para operações com imóveis
 */
class ImovelRepositorio {
    /**
     * Criar novo imóvel
     */
    async criar(dadosImovel) {
        const [resultado] = await bd.execute(`
            INSERT INTO imoveis (
                proprietario_id, condominio_id, titulo, descricao,
                tipologia, preco_mensal, area_metros_quadrados,
                numero_quartos, numero_casas_banho, tem_garagem,
                tem_piscina, esta_mobilado, status, data_disponibilidade
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            dadosImovel.proprietarioId,
            dadosImovel.condominioId,
            dadosImovel.titulo,
            dadosImovel.descricao,
            dadosImovel.tipologia,
            dadosImovel.precoMensal,
            dadosImovel.areaMetrosQuadrados,
            dadosImovel.numeroQuartos,
            dadosImovel.numeroCasasBanho,
            dadosImovel.temGaragem,
            dadosImovel.temPiscina,
            dadosImovel.estaMobilado,
            dadosImovel.status || 'em_analise',
            dadosImovel.dataDisponibilidade
        ]);

        return this.buscarPorId(resultado.insertId);
    }

    /**
     * Buscar imóvel por ID com informações completas
     */
    async buscarPorId(id) {
        const [linhas] = await bd.execute(`
            SELECT 
                i.*,
                u.nome_completo as proprietario_nome,
                u.email as proprietario_email,
                u.telefone as proprietario_telefone,
                c.nome as condominio_nome,
                c.provincia,
                c.municipio,
                c.bairro
            FROM imoveis i
            INNER JOIN utilizadores u ON i.proprietario_id = u.id
            INNER JOIN condominios c ON i.condominio_id = c.id
            WHERE i.id = ?
        `, [id]);

        if (linhas.length === 0) return null;

        const imovel = new Imovel(linhas[0]);
        
        // Buscar fotos do imóvel
        imovel.fotos = await this.buscarFotos(id);
        
        // Adicionar informações extras
        imovel.proprietario = {
            nome: linhas[0].proprietario_nome,
            email: linhas[0].proprietario_email,
            telefone: linhas[0].proprietario_telefone
        };
        
        imovel.condominio = {
            nome: linhas[0].condominio_nome,
            provincia: linhas[0].provincia,
            municipio: linhas[0].municipio,
            bairro: linhas[0].bairro
        };

        return imovel;
    }

    /**
     * Buscar fotos de um imóvel
     */
    async buscarFotos(imovelId) {
        const [linhas] = await bd.execute(
            `SELECT * FROM fotos_imoveis 
             WHERE imovel_id = ? 
             ORDER BY e_principal DESC, ordem_exibicao ASC`,
            [imovelId]
        );
        return linhas;
    }

    /**
     * Adicionar foto ao imóvel
     */
    async adicionarFoto(imovelId, caminhoArquivo, ePrincipal = false) {
        const [resultado] = await bd.execute(`
            INSERT INTO fotos_imoveis (imovel_id, caminho_arquivo, e_principal)
            VALUES (?, ?, ?)
        `, [imovelId, caminhoArquivo, ePrincipal]);

        return resultado.insertId;
    }

    /**
     * Pesquisar imóveis com filtros
     */
    async pesquisar(filtros = {}, pagina = 1, itensPorPagina = 12) {
        const deslocamento = (pagina - 1) * itensPorPagina;
        let query = `
            SELECT 
                i.*,
                c.nome as condominio_nome,
                c.provincia,
                c.municipio,
                c.bairro,
                (SELECT caminho_arquivo FROM fotos_imoveis 
                 WHERE imovel_id = i.id AND e_principal = TRUE LIMIT 1) as foto_principal
            FROM imoveis i
            INNER JOIN condominios c ON i.condominio_id = c.id
            WHERE i.status = 'disponivel'
        `;
        
        const parametros = [];

        // Aplicar filtros
        if (filtros.tipologia) {
            query += ' AND i.tipologia = ?';
            parametros.push(filtros.tipologia);
        }

        if (filtros.precoMinimo) {
            query += ' AND i.preco_mensal >= ?';
            parametros.push(filtros.precoMinimo);
        }

        if (filtros.precoMaximo) {
            query += ' AND i.preco_mensal <= ?';
            parametros.push(filtros.precoMaximo);
        }

        if (filtros.provincia) {
            query += ' AND c.provincia = ?';
            parametros.push(filtros.provincia);
        }

        if (filtros.municipio) {
            query += ' AND c.municipio = ?';
            parametros.push(filtros.municipio);
        }

        if (filtros.bairro) {
            query += ' AND c.bairro = ?';
            parametros.push(filtros.bairro);
        }

        if (filtros.temGaragem !== undefined) {
            query += ' AND i.tem_garagem = ?';
            parametros.push(filtros.temGaragem);
        }

        if (filtros.temPiscina !== undefined) {
            query += ' AND i.tem_piscina = ?';
            parametros.push(filtros.temPiscina);
        }

        if (filtros.estaMobilado !== undefined) {
            query += ' AND i.esta_mobilado = ?';
            parametros.push(filtros.estaMobilado);
        }

        // Ordenação
        query += ' ORDER BY i.data_criacao DESC';
        
        // Paginação
        query += ' LIMIT ? OFFSET ?';
        parametros.push(itensPorPagina, deslocamento);

        const [linhas] = await bd.execute(query, parametros);
        return linhas.map(linha => new Imovel(linha));
    }

    /**
     * Listar imóveis de um proprietário
     */
    async listarPorProprietario(proprietarioId) {
        const [linhas] = await bd.execute(`
            SELECT 
                i.*,
                c.nome as condominio_nome,
                (SELECT caminho_arquivo FROM fotos_imoveis 
                 WHERE imovel_id = i.id AND e_principal = TRUE LIMIT 1) as foto_principal
            FROM imoveis i
            INNER JOIN condominios c ON i.condominio_id = c.id
            WHERE i.proprietario_id = ?
            ORDER BY i.data_criacao DESC
        `, [proprietarioId]);

        return linhas.map(linha => new Imovel(linha));
    }

    /**
     * Atualizar status do imóvel
     */
    async atualizarStatus(id, novoStatus) {
        await bd.execute(
            'UPDATE imoveis SET status = ? WHERE id = ?',
            [novoStatus, id]
        );
        return this.buscarPorId(id);
    }

    /**
     * Registrar visualização do imóvel
     */
    async registrarVisualizacao(imovelId, utilizadorId = null, enderecoIp) {
        await bd.execute(`
            INSERT INTO visualizacoes_imoveis (imovel_id, utilizador_id, endereco_ip)
            VALUES (?, ?, ?)
        `, [imovelId, utilizadorId, enderecoIp]);
    }

    /**
     * Contar visualizações de um imóvel
     */
    async contarVisualizacoes(imovelId) {
        const [linhas] = await bd.execute(
            'SELECT COUNT(*) as total FROM visualizacoes_imoveis WHERE imovel_id = ?',
            [imovelId]
        );
        return linhas[0].total;
    }
}

module.exports = new ImovelRepositorio();