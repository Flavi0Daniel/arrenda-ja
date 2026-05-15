const bcrypt = require('bcryptjs');
const UtilizadorRepositorio = require('../repositorios/UtilizadorRepositorio');
const AutenticacaoServico = require('./AutenticacaoServico');

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

    //



    /**
     * Criar novo utilizador (admin)
     */
    async criar(dadosUtilizador) {
        // Validações
        if (!dadosUtilizador.email || !dadosUtilizador.senha) {
            throw new Error('Email e senha são obrigatórios');
        }

        if (!dadosUtilizador.nomeCompleto) {
            throw new Error('Nome completo é obrigatório');
        }

        const tiposPermitidos = ['proprietario', 'arrendatario', 'administrador'];
        if (!tiposPermitidos.includes(dadosUtilizador.tipoUtilizador)) {
            throw new Error('Tipo de utilizador inválido');
        }

        // Verificar se email já existe
        const utilizadorExistente = await UtilizadorRepositorio.buscarPorEmail(dadosUtilizador.email);
        if (utilizadorExistente) {
            throw new Error('Já existe um utilizador com este email');
        }

        // Encriptar senha
        const senhaEncriptada = await bcrypt.hash(dadosUtilizador.senha, 12);

        // Criar utilizador
        const novoUtilizador = await UtilizadorRepositorio.criar({
            nomeCompleto: dadosUtilizador.nomeCompleto,
            email: dadosUtilizador.email,
            senha: senhaEncriptada,
            telefone: dadosUtilizador.telefone || null,
            tipoUtilizador: dadosUtilizador.tipoUtilizador,
            fotoPerfil: null
        });

        return novoUtilizador.paraSemSenha();
    }

    /**
     * Editar utilizador (admin)
     */
    async editar(utilizadorId, dadosAtualizacao) {
        const utilizador = await UtilizadorRepositorio.buscarPorId(utilizadorId);
        
        if (!utilizador) {
            throw new Error('Utilizador não encontrado');
        }

        // Permitir editar: nome, telefone, tipo de utilizador
        const dadosPermitidos = {};

        if (dadosAtualizacao.nomeCompleto) {
            dadosPermitidos.nomeCompleto = dadosAtualizacao.nomeCompleto;
        }

        if (dadosAtualizacao.telefone !== undefined) {
            dadosPermitidos.telefone = dadosAtualizacao.telefone;
        }

        if (dadosAtualizacao.tipoUtilizador) {
            const tiposPermitidos = ['proprietario', 'arrendatario', 'administrador'];
            if (!tiposPermitidos.includes(dadosAtualizacao.tipoUtilizador)) {
                throw new Error('Tipo de utilizador inválido');
            }
            dadosPermitidos.tipoUtilizador = dadosAtualizacao.tipoUtilizador;
        }

        if (Object.keys(dadosPermitidos).length === 0) {
            throw new Error('Nenhum dado válido para atualizar');
        }

        const utilizadorAtualizado = await UtilizadorRepositorio.atualizarAdmin(utilizadorId, dadosPermitidos);
        return utilizadorAtualizado.paraSemSenha();
    }

    /**
     * Reativar utilizador (admin)
     */
    async reativar(utilizadorId) {
        await UtilizadorRepositorio.reativar(utilizadorId);
    }
}

module.exports = new UtilizadorServico();