const UtilizadorServico = require('../servicos/UtilizadorServico');

/**
 * Controlador para gestão de utilizadores
 */
class UtilizadorControlador {

    /**
     * POST /api/utilizadores/perfil/foto
     * Upload de foto de perfil
     */
    async uploadFotoPerfil(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({
                    sucesso: false,
                    mensagem: 'Nenhuma foto foi enviada'
                });
            }

            const utilizadorId = req.utilizador.id;
            const caminhoFoto = req.file.path;

            await UtilizadorServico.atualizarPerfil(utilizadorId, {
                fotoPerfil: caminhoFoto
            });

            res.json({
                sucesso: true,
                mensagem: 'Foto atualizada com sucesso',
                dados: { caminhoFoto }
            });
        } catch (erro) {
            res.status(400).json({
                sucesso: false,
                mensagem: erro.message
            });
        }
    }

    /**
     * GET /api/utilizadores/perfil
     * Obter perfil do utilizador autenticado
     */
    async obterPerfil(req, res) {
        try {
            const utilizador = req.utilizador;
            
            res.json({
                sucesso: true,
                dados: utilizador.paraSemSenha()
            });
        } catch (erro) {
            res.status(400).json({
                sucesso: false,
                mensagem: erro.message
            });
        }
    }

    /**
     * PUT /api/utilizadores/perfil
     * Atualizar perfil
     */
    async atualizarPerfil(req, res) {
        try {
            const utilizadorId = req.utilizador.id;
            const utilizadorAtualizado = await UtilizadorServico.atualizarPerfil(
                utilizadorId,
                req.body
            );
            
            res.json({
                sucesso: true,
                mensagem: 'Perfil atualizado com sucesso',
                dados: utilizadorAtualizado
            });
        } catch (erro) {
            res.status(400).json({
                sucesso: false,
                mensagem: erro.message
            });
        }
    }

    /**
     * PATCH /api/utilizadores/alterar-senha
     * Alterar senha
     */
    async alterarSenha(req, res) {
        try {
            const utilizadorId = req.utilizador.id;
            const { senhaAtual, novaSenha } = req.body;
            
            await UtilizadorServico.alterarSenha(utilizadorId, senhaAtual, novaSenha);
            
            res.json({
                sucesso: true,
                mensagem: 'Senha alterada com sucesso'
            });
        } catch (erro) {
            res.status(400).json({
                sucesso: false,
                mensagem: erro.message
            });
        }
    }

    /**
     * GET /api/utilizadores
     * Listar utilizadores (admin)
     */
    async listar(req, res) {
        try {
            const pagina = parseInt(req.query.pagina) || 1;
            const itensPorPagina = parseInt(req.query.itensPorPagina) || 10;
            const tipoUtilizador = req.query.tipo || null;
            
            const resultado = await UtilizadorServico.listar(
                pagina,
                itensPorPagina,
                tipoUtilizador
            );
            
            res.json({
                sucesso: true,
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
 * POST /api/utilizadores
 * Criar novo utilizador (admin)
 */
async criar(req, res) {
    try {
        const novoUtilizador = await UtilizadorServico.criar(req.body);
        
        res.status(201).json({
            sucesso: true,
            mensagem: 'Utilizador criado com sucesso',
            dados: novoUtilizador
        });
    } catch (erro) {
        res.status(400).json({
            sucesso: false,
            mensagem: erro.message
        });
    }
}

/**
 * PUT /api/utilizadores/:id
 * Editar utilizador (admin)
 */
async editar(req, res) {
    try {
        const utilizadorId = parseInt(req.params.id);
        const utilizadorAtualizado = await UtilizadorServico.editar(utilizadorId, req.body);
        
        res.json({
            sucesso: true,
            mensagem: 'Utilizador atualizado com sucesso',
            dados: utilizadorAtualizado
        });
    } catch (erro) {
        res.status(400).json({
            sucesso: false,
            mensagem: erro.message
        });
    }
}

    


    /**
     * DELETE /api/utilizadores/:id
     * Desativar utilizador (admin)
     */
    async desativar(req, res) {
        try {
            const utilizadorId = parseInt(req.params.id);
            
            await UtilizadorServico.desativar(utilizadorId);
            
            res.json({
                sucesso: true,
                mensagem: 'Utilizador desativado com sucesso'
            });
        } catch (erro) {
            res.status(400).json({
                sucesso: false,
                mensagem: erro.message
            });
        }
    }

    /**
     * PATCH /api/utilizadores/:id/reativar
     * Reativar utilizador
     */
    async reativar(req, res) {
        try {
            const utilizadorId = parseInt(req.params.id);
            await UtilizadorServico.reativar(utilizadorId);
            
            res.json({
                sucesso: true,
                mensagem: 'Utilizador reativado com sucesso'
            });
        } catch (erro) {
            res.status(400).json({
                sucesso: false,
                mensagem: erro.message
            });
        }
    }

}

module.exports = new UtilizadorControlador();