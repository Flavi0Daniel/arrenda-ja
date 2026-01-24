/**
 * Middleware para validar dados de registro
 */
function validarRegistro(req, res, next) {
    const { nomeCompleto, email, senha, tipoUtilizador } = req.body;
    const erros = [];

    // Validar nome completo
    if (!nomeCompleto || nomeCompleto.trim().length < 3) {
        erros.push('O nome completo deve ter pelo menos 3 caracteres');
    }

    // Validar email
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !regexEmail.test(email)) {
        erros.push('Email inválido');
    }

    // Validar senha
    if (!senha || senha.length < 6) {
        erros.push('A senha deve ter pelo menos 6 caracteres');
    }

    // Validar tipo de utilizador
    const tiposValidos = ['proprietario', 'arrendatario'];
    if (!tipoUtilizador || !tiposValidos.includes(tipoUtilizador)) {
        erros.push('Tipo de utilizador inválido');
    }

    if (erros.length > 0) {
        return res.status(400).json({
            sucesso: false,
            mensagem: 'Dados inválidos',
            erros
        });
    }

    next();
}

/**
 * Middleware para validar dados de login
 */
function validarLogin(req, res, next) {
    const { email, senha } = req.body;
    const erros = [];

    if (!email) {
        erros.push('Email é obrigatório');
    }

    if (!senha) {
        erros.push('Senha é obrigatória');
    }

    if (erros.length > 0) {
        return res.status(400).json({
            sucesso: false,
            mensagem: 'Dados inválidos',
            erros
        });
    }

    next();
}

/**
 * Middleware para validar dados de imóvel
 */
function validarImovel(req, res, next) {
    const { titulo, descricao, tipologia, precoMensal, condominioId } = req.body;
    const erros = [];

    if (!titulo || titulo.trim().length < 10) {
        erros.push('O título deve ter pelo menos 10 caracteres');
    }

    if (!descricao || descricao.trim().length < 50) {
        erros.push('A descrição deve ter pelo menos 50 caracteres');
    }

    const tipologiasValidas = ['T0', 'T1', 'T2', 'T3', 'T4', 'T5+'];
    if (!tipologia || !tipologiasValidas.includes(tipologia)) {
        erros.push('Tipologia inválida');
    }

    if (!precoMensal || isNaN(precoMensal) || parseFloat(precoMensal) <= 0) {
        erros.push('Preço mensal deve ser um valor válido maior que zero');
    }

    if (!condominioId || isNaN(condominioId)) {
        erros.push('Condomínio é obrigatório');
    }

    if (erros.length > 0) {
        return res.status(400).json({
            sucesso: false,
            mensagem: 'Dados inválidos',
            erros
        });
    }

    next();
}

/**
 * Middleware para validar solicitação de arrendamento
 */
function validarSolicitacao(req, res, next) {
    const { imovelId, mensagem } = req.body;
    const erros = [];

    if (!imovelId || isNaN(imovelId)) {
        erros.push('ID do imóvel é obrigatório');
    }

    if (mensagem && mensagem.length > 1000) {
        erros.push('A mensagem não pode exceder 1000 caracteres');
    }

    if (erros.length > 0) {
        return res.status(400).json({
            sucesso: false,
            mensagem: 'Dados inválidos',
            erros
        });
    }

    next();
}

module.exports = {
    validarRegistro,
    validarLogin,
    validarImovel,
    validarSolicitacao
};