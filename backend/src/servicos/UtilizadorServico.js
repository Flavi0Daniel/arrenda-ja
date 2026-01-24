const bcrypt = require('bcryptjs');
const UtilizadorRepositorio = require('../repositorios/UtilizadorRepositorio');

/**
 * Serviço para gestão de utilizadores
 */
class UtilizadorServico {
    /**
     * Atualizar perfil do utilizador
     */
    async atualizarPerfil(utilizadorId, dadosAtualizacao) {
        // Não permitir alterar email ou tipo de utilizador
        const { email, tipoUtilizador, senha, ...dadosPermitidos } = dadosAtualizacao;
        
        if (Object.keys(dadosPermitidos).length === 0) {
            throw new Error('Nenhum dado válido para atualizar');
        }
        
        return await UtilizadorRepositorio.atualizar(utilizadorId, dadosPermitidos);
    }

    /**
     * Alterar senha
     */
    async alterarSenha(utilizadorId, senhaAtual, novaSenha) {
        // Buscar utilizador
        const utilizador = await UtilizadorRepositorio.buscarPorId(utilizadorId);
        
        if (!utilizador) {
            throw new Error('Utilizador não encontrado');
        }
        
        // Verificar senha atual
        const senhaValida = await bcrypt.compare(senhaAtual, utilizador.senha);
        
        if (!senhaValida) {
            throw new Error('Senha atual incorreta');
        }
        
        // Validar nova senha
        if (!novaSenha || novaSenha.length < 6) {
            throw new Error('A nova senha deve ter pelo menos 6 caracteres');
        }
        
        // Encriptar nova senha
        const novaSenhaEncriptada = await bcrypt.hash(novaSenha, 12);
        
        // Atualizar senha
        await UtilizadorRepositorio.atualizar(utilizadorId, {
            senha: novaSenhaEncriptada
        });
    }

    /**
     * Listar utilizadores (admin)
     */
    async listar(pagina, itensPorPagina, tipoUtilizador) {
        const utilizadores = await UtilizadorRepositorio.listarTodos(
            pagina,
            itensPorPagina,
            tipoUtilizador
        );
        
        const total = await UtilizadorRepositorio.contarTotal(tipoUtilizador);
        
        return {
            utilizadores: utilizadores.map(u => u.paraSemSenha()),
            paginacao: {
                paginaAtual: pagina,
                itensPorPagina,
                totalItens: total,
                totalPaginas: Math.ceil(total / itensPorPagina)
            }
        };
    }

    /**
     * Desativar utilizador (admin)
     */
    async desativar(utilizadorId) {
        const utilizador = await UtilizadorRepositorio.buscarPorId(utilizadorId);
        
        if (!utilizador) {
            throw new Error('Utilizador não encontrado');
        }
        
        await UtilizadorRepositorio.desativar(utilizadorId);
    }
}

module.exports = new UtilizadorServico();