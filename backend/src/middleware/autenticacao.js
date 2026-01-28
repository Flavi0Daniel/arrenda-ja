const jwt = require('jsonwebtoken');
const UtilizadorRepositorio = require('../repositorios/UtilizadorRepositorio');

async function verificarAutenticacao(req, res, next) {
    try {
        const autorizacao = req.headers.authorization;
        
        if (!autorizacao || !autorizacao.startsWith('Bearer ')) {
            return res.status(401).json({
                sucesso: false,
                mensagem: 'Token de autenticação não fornecido'
            });
        }

        const token = autorizacao.substring(7);

        // IMPORTANTE: Use JWT_SECRET
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const utilizador = await UtilizadorRepositorio.buscarPorId(decoded.utilizadorId);
        
        if (!utilizador) {
            return res.status(401).json({
                sucesso: false,
                mensagem: 'Utilizador não encontrado'
            });
        }

        req.utilizador = utilizador;
        next();
    } catch (erro) {
        return res.status(401).json({
            sucesso: false,
            mensagem: 'Token inválido ou expirado'
        });
    }
}

function verificarProprietario(req, res, next) {
    if (!req.utilizador || !req.utilizador.eProprietario()) {
        return res.status(403).json({
            sucesso: false,
            mensagem: 'Acesso negado. Apenas proprietários podem realizar esta ação.'
        });
    }
    next();
}

function verificarArrendatario(req, res, next) {
    if (!req.utilizador || !req.utilizador.eArrendatario()) {
        return res.status(403).json({
            sucesso: false,
            mensagem: 'Acesso negado. Apenas arrendatários podem realizar esta ação.'
        });
    }
    next();
}

function verificarAdministrador(req, res, next) {
    if (!req.utilizador || !req.utilizador.eAdministrador()) {
        return res.status(403).json({
            sucesso: false,
            mensagem: 'Acesso negado. Apenas administradores podem realizar esta ação.'
        });
    }
    next();
}

async function autenticacaoOpcional(req, res, next) {
    try {
        const autorizacao = req.headers.authorization;
        
        if (autorizacao && autorizacao.startsWith('Bearer ')) {
            const token = autorizacao.substring(7);
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
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