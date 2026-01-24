/**
 * Validar email
 */
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

/**
 * Validar telefone angolano
 */
function validarTelefone(telefone) {
    // Aceita formatos: +244 923 456 789, 923456789, etc.
    const regex = /^(\+244)?[9][0-9]{8}$/;
    return regex.test(telefone.replace(/\s/g, ''));
}

/**
 * Validar senha forte
 */
function validarSenhaForte(senha) {
    // Pelo menos 8 caracteres, 1 maiúscula, 1 minúscula, 1 número
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(senha);
}

/**
 * Sanitizar string (remover caracteres especiais)
 */
function sanitizarString(str) {
    return str.replace(/[^\w\s-]/gi, '').trim();
}

module.exports = {
    validarEmail,
    validarTelefone,
    validarSenhaForte,
    sanitizarString
};