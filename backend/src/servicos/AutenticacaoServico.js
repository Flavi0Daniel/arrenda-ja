const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UtilizadorRepositorio = require('../repositorios/UtilizadorRepositorio');

/**
 * Serviço responsável pela autenticação de utilizadores
 */
class AutenticacaoServico {
    /**
     * Registar novo utilizador no sistema
     */
    async registar(dadosUtilizador) {
        // Verificar se o email já existe
        const utilizadorExistente = await UtilizadorRepositorio.buscarPorEmail(dadosUtilizador.email);
        
        if (utilizadorExistente) {
            throw new Error('Este email já está registado no sistema');
        }

        // Validar tipo de utilizador
        const tiposPermitidos = ['proprietario', 'arrendatario'];
        if (!tiposPermitidos.includes(dadosUtilizador.tipoUtilizador)) {
            throw new Error('Tipo de utilizador inválido');
        }

        // Encriptar a senha
        const senhaEncriptada = await bcrypt.hash(dadosUtilizador.senha, 12);

        //Criar utilizador
const novoUtilizador = await UtilizadorRepositorio.criar({
nomeCompleto: dadosUtilizador.nomeCompleto,
email: dadosUtilizador.email,
senha: senhaEncriptada,
telefone: dadosUtilizador.telefone,
tipoUtilizador: dadosUtilizador.tipoUtilizador,
fotoPerfil: dadosUtilizador.fotoPerfil || null
});
    // Gerar token JWT
    const token = this.gerarToken(novoUtilizador.id);

    return {
        utilizador: novoUtilizador.paraSemSenha(),
        token
    };
}

/**
 * Autenticar utilizador (login)
 */
async autenticar(email, senha) {
    // Buscar utilizador
    const utilizador = await UtilizadorRepositorio.buscarPorEmail(email);
    
    if (!utilizador) {
        throw new Error('Email ou senha incorretos');
    }

    // Verificar senha
    const senhaValida = await bcrypt.compare(senha, utilizador.senha);
    
    if (!senhaValida) {
        throw new Error('Email ou senha incorretos');
    }

    // Gerar token
    const token = this.gerarToken(utilizador.id);

    return {
        utilizador: utilizador.paraSemSenha(),
        token
    };
}

/**
 * Gerar token JWT
 */
gerarToken(utilizadorId) {
    return jwt.sign(
        { utilizadorId },
        process.env.JWT_SEGREDO,
        { expiresIn: process.env.JWT_EXPIRACAO || '7d' }
    );
}

/**
 * Verificar token JWT
 */
verificarToken(token) {
    try {
        return jwt.verify(token, process.env.JWT_SEGREDO);
    } catch (erro) {
        throw new Error('Token inválido ou expirado');
    }
}
}
module.exports = new AutenticacaoServico();