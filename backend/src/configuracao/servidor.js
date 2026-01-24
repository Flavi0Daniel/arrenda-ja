/**
 * Configurações gerais do servidor
 */
const configuracaoServidor = {
    porta: process.env.PORTA || 3000,
    ambiente: process.env.AMBIENTE_NODE || 'development',
    
    // URLs permitidas para CORS
    urlsPermitidas: [
        'http://localhost:4200',
        'http://localhost:3000',
        process.env.FRONTEND_URL
    ].filter(Boolean),
    
    // Limites de requisição
    limites: {
        tamanhoJson: '10mb',
        tamanhoUrlEncoded: '10mb',
        taxaLimite: {
            janelaTempo: 15 * 60 * 1000, // 15 minutos
            maxRequisicoes: 100
        }
    },
    
    // Configurações de sessão
    sessao: {
        segredo: process.env.JWT_SEGREDO,
        expiracao: process.env.JWT_EXPIRACAO || '7d'
    },
    
    // Paginação padrão
    paginacao: {
        itensPorPagina: 12,
        maxItensPorPagina: 100
    }
};

module.exports = configuracaoServidor;