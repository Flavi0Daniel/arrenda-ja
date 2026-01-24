const bd = require('../configuracao/baseDados');

/**
 * Serviço para geração de relatórios
 */
class RelatorioServico {
    /**
     * Relatório de imóveis mais visualizados
     */
    async imoveisMaisVisualizados(limite = 10) {
        const [linhas] = await bd.execute(`
            SELECT 
                i.id,
                i.titulo,
                i.preco_mensal,
                c.nome as condominio_nome,
                COUNT(v.id) as total_visualizacoes,
                (SELECT caminho_arquivo FROM fotos_imoveis 
                 WHERE imovel_id = i.id AND e_principal = TRUE LIMIT 1) as foto_principal
            FROM imoveis i
            LEFT JOIN visualizacoes_imoveis v ON i.id = v.imovel_id
            INNER JOIN condominios c ON i.condominio_id = c.id
            WHERE i.status = 'disponivel'
            GROUP BY i.id
            ORDER BY total_visualizacoes DESC
            LIMIT ?
        `, [limite]);
        
        return linhas;
    }

    /**
     * Relatório de solicitações por condomínio
     */
    async solicitacoesPorCondominio() {
        const [linhas] = await bd.execute(`
            SELECT 
                c.nome as condominio,
                c.provincia,
                c.municipio,
                COUNT(s.id) as total_solicitacoes,
                SUM(CASE WHEN s.status = 'pendente' THEN 1 ELSE 0 END) as pendentes,
                SUM(CASE WHEN s.status = 'aceite' THEN 1 ELSE 0 END) as aceites,
                SUM(CASE WHEN s.status = 'recusada' THEN 1 ELSE 0 END) as recusadas
            FROM condominios c
            LEFT JOIN imoveis i ON c.id = i.condominio_id
            LEFT JOIN solicitacoes_arrendamento s ON i.id = s.imovel_id
            GROUP BY c.id
            ORDER BY total_solicitacoes DESC
        `);
        
        return linhas;
    }

    /**
     * Relatório de proprietários ativos
     */
    async proprietariosAtivos() {
        const [linhas] = await bd.execute(`
            SELECT 
                u.id,
                u.nome_completo,
                u.email,
                u.telefone,
                COUNT(DISTINCT i.id) as total_imoveis,
                COUNT(DISTINCT s.id) as total_solicitacoes,
                SUM(CASE WHEN i.status = 'disponivel' THEN 1 ELSE 0 END) as imoveis_disponiveis,
                SUM(CASE WHEN i.status = 'arrendado' THEN 1 ELSE 0 END) as imoveis_arrendados
            FROM utilizadores u
            LEFT JOIN imoveis i ON u.id = i.proprietario_id
            LEFT JOIN solicitacoes_arrendamento s ON i.id = s.imovel_id
            WHERE u.tipo_utilizador = 'proprietario' AND u.esta_ativo = TRUE
            GROUP BY u.id
            HAVING total_imoveis > 0
            ORDER BY total_imoveis DESC
        `);
        
        return linhas;
    }

    /**
     * Estatísticas gerais do sistema
     */
    async estatisticasGerais() {
        // Total de utilizadores por tipo
        const [utilizadores] = await bd.execute(`
            SELECT 
                tipo_utilizador,
                COUNT(*) as total
            FROM utilizadores
            WHERE esta_ativo = TRUE
            GROUP BY tipo_utilizador
        `);
        
        // Total de imóveis por status
        const [imoveis] = await bd.execute(`
            SELECT 
                status,
                COUNT(*) as total
            FROM imoveis
            GROUP BY status
        `);
        
        // Total de solicitações por status
        const [solicitacoes] = await bd.execute(`
            SELECT 
                status,
                COUNT(*) as total
            FROM solicitacoes_arrendamento
            GROUP BY status
        `);
        
        // Mensagens não lidas
        const [mensagens] = await bd.execute(`
            SELECT COUNT(*) as total_nao_lidas
            FROM mensagens
            WHERE foi_lida = FALSE
        `);
        
        return {
            utilizadores,
            imoveis,
            solicitacoes,
            mensagensNaoLidas: mensagens[0].total_nao_lidas
        };
    }

    /**
     * Relatório de faixa de preços
     */
    async imoveisPorFaixaPreco() {
        const [linhas] = await bd.execute(`
            SELECT 
                CASE 
                    WHEN preco_mensal < 50000 THEN 'Até 50.000 Kz'
                    WHEN preco_mensal < 100000 THEN '50.000 - 100.000 Kz'
                    WHEN preco_mensal < 200000 THEN '100.000 - 200.000 Kz'
                    WHEN preco_mensal < 500000 THEN '200.000 - 500.000 Kz'
                    ELSE 'Acima de 500.000 Kz'
                END as faixa_preco,
                COUNT(*) as total_imoveis
            FROM imoveis
            WHERE status = 'disponivel'
            GROUP BY faixa_preco
            ORDER BY MIN(preco_mensal)
        `);
        
        return linhas;
    }
}

module.exports = new RelatorioServico();