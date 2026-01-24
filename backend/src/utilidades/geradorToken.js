const crypto = require('crypto');

/**
 * Gerar token aleatório
 */
function gerarTokenAleatorio(tamanho = 32) {
    return crypto.randomBytes(tamanho).toString('hex');
}

/**
 * Gerar código numérico
 */
function gerarCodigoNumerico(digitos = 6) {
    const min = Math.pow(10, digitos - 1);
    const max = Math.pow(10, digitos) - 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
    gerarTokenAleatorio,
    gerarCodigoNumerico
};