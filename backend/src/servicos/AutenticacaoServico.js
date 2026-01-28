const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UtilizadorRepositorio = require('../repositorios/UtilizadorRepositorio');

class AutenticacaoServico {
    async registar(dadosUtilizador) {
        const utilizadorExistente = await UtilizadorRepositorio.buscarPorEmail(dadosUtilizador.email);
        
        if (utilizadorExistente) {
            throw new Error('Este email já está registado no sistema');
        }

        const tiposPermitidos = ['proprietario', 'arrendatario'];
        if (!tiposPermitidos.includes(dadosUtilizador.tipoUtilizador)) {
            throw new Error('Tipo de utilizador inválido');
        }

        const senhaEncriptada = await bcrypt.hash(dadosUtilizador.senha, 12);

        const novoUtilizador = await UtilizadorRepositorio.criar({
            nomeCompleto: dadosUtilizador.nomeCompleto,
            email: dadosUtilizador.email,
            senha: senhaEncriptada,
            telefone: dadosUtilizador.telefone,
            tipoUtilizador: dadosUtilizador.tipoUtilizador,
            fotoPerfil: dadosUtilizador.fotoPerfil || null
        });

        const token = this.gerarToken(novoUtilizador.id);

        return {
            utilizador: novoUtilizador.paraSemSenha(),
            token
        };
    }

    async autenticar(email, senha) {
        const utilizador = await UtilizadorRepositorio.buscarPorEmail(email);
        
        if (!utilizador) {
            throw new Error('Email ou senha incorretos');
        }

        const senhaValida = await bcrypt.compare(senha, utilizador.senha);
        
        if (!senhaValida) {
            throw new Error('Email ou senha incorretos');
        }

        const token = this.gerarToken(utilizador.id);

        return {
            utilizador: utilizador.paraSemSenha(),
            token
        };
    }

    gerarToken(utilizadorId) {
        // IMPORTANTE: Use JWT_SECRET (sem O no final)
        const secret = process.env.JWT_SECRET;
        
        if (!secret) {
            throw new Error('JWT_SECRET não está configurado no arquivo .env');
        }

        return jwt.sign(
            { utilizadorId },
            secret,
            { expiresIn: process.env.JWT_EXPIRACAO || '7d' }
        );
    }

    verificarToken(token) {
        try {
            const secret = process.env.JWT_SECRET;
            
            if (!secret) {
                throw new Error('JWT_SECRET não está configurado');
            }
            
            return jwt.verify(token, secret);
        } catch (erro) {
            throw new Error('Token inválido ou expirado');
        }
    }
}

module.exports = new AutenticacaoServico();