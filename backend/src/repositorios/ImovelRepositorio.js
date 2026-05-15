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
                c.bairro,
                (SELECT caminho_arquivo FROM fotos_imoveis 
                WHERE imovel_id = i.id AND e_principal = TRUE LIMIT 1) as foto_principal
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
        // Garantir que pagina e itensPorPagina são números
        pagina = parseInt(pagina) || 1;
        itensPorPagina = parseInt(itensPorPagina) || 12;
        
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

        if (filtros.precoMinimo !== null && filtros.precoMinimo !== undefined) {
            query += ' AND i.preco_mensal >= ?';
            parametros.push(parseFloat(filtros.precoMinimo));
        }

        if (filtros.precoMaximo !== null && filtros.precoMaximo !== undefined) {
            query += ' AND i.preco_mensal <= ?';
            parametros.push(parseFloat(filtros.precoMaximo));
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

        // Filtros booleanos - não usar como parâmetros
        if (filtros.temGaragem === true) {
            query += ' AND i.tem_garagem = 1';
        } else if (filtros.temGaragem === false) {
            query += ' AND i.tem_garagem = 0';
        }

        if (filtros.temPiscina === true) {
            query += ' AND i.tem_piscina = 1';
        } else if (filtros.temPiscina === false) {
            query += ' AND i.tem_piscina = 0';
        }

        if (filtros.estaMobilado === true) {
            query += ' AND i.esta_mobilado = 1';
        } else if (filtros.estaMobilado === false) {
            query += ' AND i.esta_mobilado = 0';
        }

       // Ordenação
        query += ' ORDER BY i.data_criacao DESC';
        
        // Paginação - usar valores diretos para evitar erro do MySQL2
        query += ` LIMIT ${itensPorPagina} OFFSET ${deslocamento}`;

        console.log('🔍 DEBUG PESQUISA:');
        console.log('  Query final:', query);
        console.log('  Parâmetros:', parametros);

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
     * Listar todos os imóveis (admin)
     */
    async listarTodos() {
        const [linhas] = await bd.execute(`
            SELECT 
                i.*,
                u.nome_completo as proprietario_nome,
                u.email as proprietario_email,
                u.telefone as proprietario_telefone,
                c.nome as condominio_nome,
                c.provincia,
                c.municipio,
                c.bairro,
                (SELECT caminho_arquivo FROM fotos_imoveis 
                 WHERE imovel_id = i.id AND e_principal = TRUE LIMIT 1) as foto_principal
            FROM imoveis i
            INNER JOIN utilizadores u ON i.proprietario_id = u.id
            INNER JOIN condominios c ON i.condominio_id = c.id
            ORDER BY 
                CASE i.status
                    WHEN 'em_analise' THEN 1
                    WHEN 'disponivel' THEN 2
                    WHEN 'arrendado' THEN 3
                    WHEN 'inativo' THEN 4
                END,
                i.data_criacao DESC
        `);

        return linhas.map(linha => {
            const imovel = new Imovel(linha);
            
            // Adicionar informações extras
            imovel.proprietario = {
                nome: linha.proprietario_nome,
                email: linha.proprietario_email,
                telefone: linha.proprietario_telefone
            };
            
            imovel.condominio = {
                nome: linha.condominio_nome,
                provincia: linha.provincia,
                municipio: linha.municipio,
                bairro: linha.bairro
            };
            
            return imovel;
        });
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
     * Atualizar imóvel
     */
    async atualizar(id, dadosAtualizacao) {
        const campos = [];
        const valores = [];

        if (dadosAtualizacao.titulo) {
            campos.push('titulo = ?');
            valores.push(dadosAtualizacao.titulo);
        }

        if (dadosAtualizacao.descricao) {
            campos.push('descricao = ?');
            valores.push(dadosAtualizacao.descricao);
        }

        if (dadosAtualizacao.precoMensal) {
            campos.push('preco_mensal = ?');
            valores.push(dadosAtualizacao.precoMensal);
        }

        if (dadosAtualizacao.areaMetrosQuadrados) {
            campos.push('area_metros_quadrados = ?');
            valores.push(dadosAtualizacao.areaMetrosQuadrados);
        }

        if (dadosAtualizacao.numeroQuartos !== undefined) {
            campos.push('numero_quartos = ?');
            valores.push(dadosAtualizacao.numeroQuartos);
        }

        if (dadosAtualizacao.numeroCasasBanho !== undefined) {
            campos.push('numero_casas_banho = ?');
            valores.push(dadosAtualizacao.numeroCasasBanho);
        }

        if (dadosAtualizacao.temGaragem !== undefined) {
            campos.push('tem_garagem = ?');
            valores.push(dadosAtualizacao.temGaragem);
        }

        if (dadosAtualizacao.temPiscina !== undefined) {
            campos.push('tem_piscina = ?');
            valores.push(dadosAtualizacao.temPiscina);
        }

        if (dadosAtualizacao.estaMobilado !== undefined) {
            campos.push('esta_mobilado = ?');
            valores.push(dadosAtualizacao.estaMobilado);
        }

        if (campos.length === 0) {
            throw new Error('Nenhum campo para atualizar');
        }

        valores.push(id);

        await bd.execute(
            `UPDATE imoveis SET ${campos.join(', ')} WHERE id = ?`,
            valores
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

    /**
    * Remover foto do imóvel
    */
    async removerFoto(fotoId) {
    await bd.execute(
        'DELETE FROM fotos_imoveis WHERE id = ?',
        [fotoId]
    );
    }

    /**
     * Atualizar apenas o status do imóvel
     */
    async atualizarStatus(id, status) {
        await bd.execute(
            'UPDATE imoveis SET status = ? WHERE id = ?',
            [status, id]
        );
    }

}

module.exports = new ImovelRepositorio();