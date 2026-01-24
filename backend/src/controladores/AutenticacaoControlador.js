const AutenticacaoServico = require('../servicos/AutenticacaoServico');

/**
 * Controlador para rotas de autenticação
 */
class AutenticacaoControlador {
    /**
     * POST /api/autenticacao/registar
     * Registar novo utilizador
     */
    async registar(req, res) {
        try {
            const resultado = await AutenticacaoServico.registar(req.body);
            
            res.status(201).json({
                sucesso: true,
                mensagem: 'Utilizador registado com sucesso',
                dados: resultado
            });
        } catch (erro) {
            res.status(400).json({
                sucesso: false,
                mensagem: erro.message
            });
        }
    }

    /**
     * POST /api/autenticacao/entrar
     * Fazer login
     */
    async entrar(req, res) {
        try {
            const { email, senha } = req.body;
            const resultado = await AutenticacaoServico.autenticar(email, senha);
            
            res.json({
                sucesso: true,
                mensagem: 'Login realizado com sucesso',
                dados: resultado
            });
        } catch (erro) {
            res.status(401).json({
                sucesso: false,
                mensagem: erro.message
            });
        }
    }

    /**
     * GET /api/autenticacao/perfil
     * Obter perfil do utilizador autenticado
     */
    async obterPerfil(req, res) {
        try {
            // req.utilizador é definido pelo middleware de autenticação
            res.json({
                sucesso: true,
                dados: req.utilizador.paraSemSenha()
            });
        } catch (erro) {
            res.status(400).json({
                sucesso: false,
                mensagem: erro.message
            });
        }
    }
}

module.exports = new AutenticacaoControlador();