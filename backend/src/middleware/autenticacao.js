const jwt = require('jsonwebtoken');
const UtilizadorRepositorio = require('../repositorios/UtilizadorRepositorio');

/**
 * Middleware para verificar se o utilizador está autenticado
 */
async function verificarAutenticacao(req, res, next) {
    try {
        // Obter token do cabeçalho
        const autorizacao = req.headers.authorization;
        
        if (!autorizacao || !autorizacao.startsWith('Bearer ')) {
            return res.status(401).json({
                sucesso: false,
                mensagem: 'Token de autenticação não fornecido'
            });
        }

        const token = autorizacao.substring(7); // Remover "Bearer "

        // Verificar token
        const decoded = jwt.verify(token, process.env.JWT_SEGREDO);

        // Buscar utilizador
        const utilizador = await UtilizadorRepositorio.buscarPorId(decoded.utilizadorId);
        
        if (!utilizador) {
            return res.status(401).json({
                sucesso: false,
                mensagem: 'Utilizador não encontrado'
            });
        }

        // Adicionar utilizador ao request
        req.utilizador = utilizador;
        next();
    } catch (erro) {
        return res.status(401).json({
            sucesso: false,
            mensagem: 'Token inválido ou expirado'
        });
    }
}

/**
 * Middleware para verificar se o utilizador é proprietário
 */
function verificarProprietario(req, res, next) {
    if (!req.utilizador || !req.utilizador.eProprietario()) {
        return res.status(403).json({
            sucesso: false,
            mensagem: 'Acesso negado. Apenas proprietários podem realizar esta ação.'
        });
    }
    next();
}

/**
 * Middleware para verificar se o utilizador é arrendatário
 */
function verificarArrendatario(req, res, next) {
    if (!req.utilizador || !req.utilizador.eArrendatario()) {
        return res.status(403).json({
            sucesso: false,
            mensagem: 'Acesso negado. Apenas arrendatários podem realizar esta ação.'
        });
    }
    next();
}

/**
 * Middleware para verificar se o utilizador é administrador
 */
function verificarAdministrador(req, res, next) {
    if (!req.utilizador || !req.utilizador.eAdministrador()) {
        return res.status(403).json({
            sucesso: false,
            mensagem: 'Acesso negado. Apenas administradores podem realizar esta ação.'
        });
    }
    next();
}

/**
 * Middleware opcional de autenticação (não retorna erro se não houver token)
 */
async function autenticacaoOpcional(req, res, next) {
    try {
        const autorizacao = req.headers.authorization;
        
        if (autorizacao && autorizacao.startsWith('Bearer ')) {
            const token = autorizacao.substring(7);
            const decoded = jwt.verify(token, process.env.JWT_SEGREDO);
            const utilizador = await UtilizadorRepositorio.buscarPorId(decoded.utilizadorId);
            
            if (utilizador) {
                req.utilizador = utilizador;
            }
        }
    } catch (erro) {
        // Ignora erros e continua sem autenticação
    }
    
    next();
}

module.exports = {
    verificarAutenticacao,
    verificarProprietario,
    verificarArrendatario,
    verificarAdministrador,
    autenticacaoOpcional
};