const bd = require('../configuracao/baseDados');

/**
 * Controlador para estatísticas do sistema
 */
class EstatisticaControlador {
    /**
     * GET /api/estatisticas/administrador
     * Estatísticas gerais para o administrador
     */
    async obterEstatisticasAdmin(req, res) {
        try {
            // Total de imóveis por status
            const [imoveis] = await bd.execute(`
                SELECT 
                    COUNT(*) as total,
                    SUM(CASE WHEN status = 'disponivel' THEN 1 ELSE 0 END) as disponiveis,
                    SUM(CASE WHEN status = 'arrendado' THEN 1 ELSE 0 END) as arrendados,
                    SUM(CASE WHEN status = 'em_analise' THEN 1 ELSE 0 END) as em_analise,
                    SUM(CASE WHEN status = 'inativo' THEN 1 ELSE 0 END) as inativos
                FROM imoveis
            `);

            // Total de utilizadores por tipo
            const [utilizadores] = await bd.execute(`
                SELECT 
                    COUNT(*) as total,
                    SUM(CASE WHEN tipo_utilizador = 'proprietario' THEN 1 ELSE 0 END) as proprietarios,
                    SUM(CASE WHEN tipo_utilizador = 'arrendatario' THEN 1 ELSE 0 END) as arrendatarios,
                    SUM(CASE WHEN tipo_utilizador = 'administrador' THEN 1 ELSE 0 END) as administradores
                FROM utilizadores
                WHERE esta_ativo = TRUE
            `);

            // Total de solicitações por status
            const [solicitacoes] = await bd.execute(`
                SELECT 
                    COUNT(*) as total,
                    SUM(CASE WHEN status = 'pendente' THEN 1 ELSE 0 END) as pendentes,
                    SUM(CASE WHEN status = 'aceite' THEN 1 ELSE 0 END) as aceites,
                    SUM(CASE WHEN status = 'recusada' THEN 1 ELSE 0 END) as recusadas
                FROM solicitacoes_arrendamento
            `);

            // Total de mensagens
            const [mensagens] = await bd.execute(`
                SELECT 
                    COUNT(*) as total,
                    SUM(CASE WHEN foi_lida = FALSE THEN 1 ELSE 0 END) as nao_lidas
                FROM mensagens
            `);

            res.json({
                sucesso: true,
                dados: {
                    imoveis: imoveis[0],
                    utilizadores: utilizadores[0],
                    solicitacoes: solicitacoes[0],
                    mensagens: mensagens[0]
                }
            });
        } catch (erro) {
            console.error('Erro ao obter estatísticas:', erro);
            res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao obter estatísticas'
            });
        }
    }

    /**
     * GET /api/estatisticas/proprietario/:id
     * Estatísticas para um proprietário específico
     */
    async obterEstatisticasProprietario(req, res) {
        try {
            const proprietarioId = req.params.id;

            // Estatísticas dos imóveis do proprietário
            const [imoveis] = await bd.execute(`
                SELECT 
                    COUNT(*) as total,
                    SUM(CASE WHEN status = 'disponivel' THEN 1 ELSE 0 END) as disponiveis,
                    SUM(CASE WHEN status = 'arrendado' THEN 1 ELSE 0 END) as arrendados,
                    SUM(CASE WHEN status = 'em_analise' THEN 1 ELSE 0 END) as em_analise,
                    SUM(CASE WHEN status = 'inativo' THEN 1 ELSE 0 END) as inativos
                FROM imoveis
                WHERE proprietario_id = ?
            `, [proprietarioId]);

            // Total de solicitações recebidas
            const [solicitacoes] = await bd.execute(`
                SELECT 
                    COUNT(*) as total,
                    SUM(CASE WHEN s.status = 'pendente' THEN 1 ELSE 0 END) as pendentes,
                    SUM(CASE WHEN s.status = 'aceite' THEN 1 ELSE 0 END) as aceites,
                    SUM(CASE WHEN s.status = 'recusada' THEN 1 ELSE 0 END) as recusadas
                FROM solicitacoes_arrendamento s
                INNER JOIN imoveis i ON s.imovel_id = i.id
                WHERE i.proprietario_id = ?
            `, [proprietarioId]);

            // Total de visualizações nos imóveis
            const [visualizacoes] = await bd.execute(`
                SELECT COUNT(*) as total
                FROM visualizacoes_imoveis v
                INNER JOIN imoveis i ON v.imovel_id = i.id
                WHERE i.proprietario_id = ?
            `, [proprietarioId]);

            res.json({
                sucesso: true,
                dados: {
                    imoveis: imoveis[0],
                    solicitacoes: solicitacoes[0],
                    visualizacoes: visualizacoes[0].total
                }
            });
        } catch (erro) {
            console.error('Erro ao obter estatísticas do proprietário:', erro);
            res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao obter estatísticas'
            });
        }
    }

    /**
     * GET /api/estatisticas/arrendatario/:id
     * Estatísticas para um arrendatário específico
     */
    async obterEstatisticasArrendatario(req, res) {
        try {
            const arrendatarioId = req.params.id;

            // Estatísticas das solicitações do arrendatário
            const [solicitacoes] = await bd.execute(`
                SELECT 
                    COUNT(*) as total,
                    SUM(CASE WHEN status = 'pendente' THEN 1 ELSE 0 END) as pendentes,
                    SUM(CASE WHEN status = 'aceite' THEN 1 ELSE 0 END) as aceites,
                    SUM(CASE WHEN status = 'recusada' THEN 1 ELSE 0 END) as recusadas,
                    SUM(CASE WHEN status = 'cancelada' THEN 1 ELSE 0 END) as canceladas
                FROM solicitacoes_arrendamento
                WHERE arrendatario_id = ?
            `, [arrendatarioId]);

            res.json({
                sucesso: true,
                dados: {
                    solicitacoes: solicitacoes[0]
                }
            });
        } catch (erro) {
            console.error('Erro ao obter estatísticas do arrendatário:', erro);
            res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao obter estatísticas'
            });
        }
    }

    /**
     * GET /api/estatisticas/relatorio-imoveis
     * Relatório detalhado de imóveis
     */
    async obterRelatorioImoveis(req, res) {
        try {
            // Imóveis por tipologia
            const [porTipologia] = await bd.execute(`
                SELECT 
                    tipologia,
                    COUNT(*) as total,
                    AVG(preco_mensal) as preco_medio
                FROM imoveis
                GROUP BY tipologia
                ORDER BY tipologia
            `);

            // Imóveis por província
            const [porProvincia] = await bd.execute(`
                SELECT 
                    c.provincia,
                    COUNT(i.id) as total,
                    AVG(i.preco_mensal) as preco_medio
                FROM imoveis i
                INNER JOIN condominios c ON i.condominio_id = c.id
                GROUP BY c.provincia
                ORDER BY total DESC
            `);

            // Imóveis mais visualizados (top 10)
            const [maisVisualizados] = await bd.execute(`
                SELECT 
                    i.id,
                    i.titulo,
                    i.preco_mensal,
                    c.nome as condominio,
                    COUNT(v.id) as total_visualizacoes
                FROM imoveis i
                LEFT JOIN visualizacoes_imoveis v ON i.id = v.imovel_id
                INNER JOIN condominios c ON i.condominio_id = c.id
                WHERE i.status = 'disponivel'
                GROUP BY i.id, i.titulo, i.preco_mensal, c.nome
                ORDER BY total_visualizacoes DESC
                LIMIT 10
            `);

            // Preço médio por status
            const [precoPorStatus] = await bd.execute(`
                SELECT 
                    status,
                    COUNT(*) as total,
                    AVG(preco_mensal) as preco_medio,
                    MIN(preco_mensal) as preco_minimo,
                    MAX(preco_mensal) as preco_maximo
                FROM imoveis
                GROUP BY status
            `);

            res.json({
                sucesso: true,
                dados: {
                    porTipologia,
                    porProvincia,
                    maisVisualizados,
                    precoPorStatus
                }
            });
        } catch (erro) {
            console.error('Erro ao obter relatório de imóveis:', erro);
            res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao obter relatório de imóveis'
            });
        }
    }

    /**
     * GET /api/estatisticas/relatorio-utilizadores
     * Relatório detalhado de utilizadores
     */
    async obterRelatorioUtilizadores(req, res) {
        try {
            // Novos utilizadores por mês (últimos 12 meses)
            const [novosPorMes] = await bd.execute(`
                SELECT 
                    DATE_FORMAT(data_criacao, '%Y-%m') as mes,
                    COUNT(*) as total,
                    SUM(CASE WHEN tipo_utilizador = 'proprietario' THEN 1 ELSE 0 END) as proprietarios,
                    SUM(CASE WHEN tipo_utilizador = 'arrendatario' THEN 1 ELSE 0 END) as arrendatarios
                FROM utilizadores
                WHERE data_criacao >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
                GROUP BY DATE_FORMAT(data_criacao, '%Y-%m')
                ORDER BY mes DESC
            `);

            // Proprietários mais ativos (com mais imóveis)
            const [proprietariosAtivos] = await bd.execute(`
                SELECT 
                    u.id,
                    u.nome_completo,
                    u.email,
                    COUNT(i.id) as total_imoveis,
                    SUM(CASE WHEN i.status = 'disponivel' THEN 1 ELSE 0 END) as disponiveis,
                    SUM(CASE WHEN i.status = 'arrendado' THEN 1 ELSE 0 END) as arrendados
                FROM utilizadores u
                INNER JOIN imoveis i ON u.id = i.proprietario_id
                WHERE u.tipo_utilizador = 'proprietario' AND u.esta_ativo = TRUE
                GROUP BY u.id, u.nome_completo, u.email
                ORDER BY total_imoveis DESC
                LIMIT 10
            `);

            // Taxa de atividade (utilizadores ativos vs inativos)
            const [taxaAtividade] = await bd.execute(`
                SELECT 
                    COUNT(*) as total,
                    SUM(CASE WHEN esta_ativo = TRUE THEN 1 ELSE 0 END) as ativos,
                    SUM(CASE WHEN esta_ativo = FALSE THEN 1 ELSE 0 END) as inativos
                FROM utilizadores
            `);

            res.json({
                sucesso: true,
                dados: {
                    novosPorMes,
                    proprietariosAtivos,
                    taxaAtividade: taxaAtividade[0]
                }
            });
        } catch (erro) {
            console.error('Erro ao obter relatório de utilizadores:', erro);
            res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao obter relatório de utilizadores'
            });
        }
    }

    /**
     * GET /api/estatisticas/relatorio-financeiro
     * Relatório financeiro
     */
    async obterRelatorioFinanceiro(req, res) {
        try {
            // Receita estimada (soma dos imóveis arrendados)
            const [receitaEstimada] = await bd.execute(`
                SELECT 
                    COUNT(*) as total_arrendados,
                    SUM(preco_mensal) as receita_mensal_estimada,
                    AVG(preco_mensal) as valor_medio_arrendamento
                FROM imoveis
                WHERE status = 'arrendado'
            `);

            // Receita por província
            const [receitaPorProvincia] = await bd.execute(`
                SELECT 
                    c.provincia,
                    COUNT(i.id) as total_arrendados,
                    SUM(i.preco_mensal) as receita_mensal,
                    AVG(i.preco_mensal) as valor_medio
                FROM imoveis i
                INNER JOIN condominios c ON i.condominio_id = c.id
                WHERE i.status = 'arrendado'
                GROUP BY c.provincia
                ORDER BY receita_mensal DESC
            `);

            // Receita por condomínio (top 10)
            const [receitaPorCondominio] = await bd.execute(`
                SELECT 
                    c.nome,
                    c.provincia,
                    c.municipio,
                    COUNT(i.id) as total_arrendados,
                    SUM(i.preco_mensal) as receita_mensal
                FROM imoveis i
                INNER JOIN condominios c ON i.condominio_id = c.id
                WHERE i.status = 'arrendado'
                GROUP BY c.id, c.nome, c.provincia, c.municipio
                ORDER BY receita_mensal DESC
                LIMIT 10
            `);

            // Potencial de receita (imóveis disponíveis)
            const [potencialReceita] = await bd.execute(`
                SELECT 
                    COUNT(*) as total_disponiveis,
                    SUM(preco_mensal) as potencial_mensal,
                    AVG(preco_mensal) as valor_medio
                FROM imoveis
                WHERE status = 'disponivel'
            `);

            res.json({
                sucesso: true,
                dados: {
                    receitaEstimada: receitaEstimada[0],
                    receitaPorProvincia,
                    receitaPorCondominio,
                    potencialReceita: potencialReceita[0]
                }
            });
        } catch (erro) {
            console.error('Erro ao obter relatório financeiro:', erro);
            res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao obter relatório financeiro'
            });
        }
    }
}

module.exports = new EstatisticaControlador();