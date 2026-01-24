/**
 * Formatar preço em Kwanzas
 */
function formatarPreco(valor) {
    return new Intl.NumberFormat('pt-AO', {
        style: 'currency',
        currency: 'AOA'
    }).format(valor);
}

/**
 * Formatar data
 */
function formatarData(data, incluirHora = false) {
    const opcoes = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    
    if (incluirHora) {
        opcoes.hour = '2-digit';
        opcoes.minute = '2-digit';
    }
    
    return new Date(data).toLocaleDateString('pt-AO', opcoes);
}

/**
 * Formatar telefone
 */
function formatarTelefone(telefone) {
    // Formato: +244 923 456 789
    const limpo = telefone.replace(/\D/g, '');
    
    if (limpo.length === 9) {
        return `+244 ${limpo.slice(0, 3)} ${limpo.slice(3, 6)} ${limpo.slice(6)}`;
    }
    
    return telefone;
}

/**
 * Truncar texto
 */
function truncarTexto(texto, tamanhoMaximo = 100) {
if (texto.length <= tamanhoMaximo) return texto;
return texto.substring(0, tamanhoMaximo) + '...';
}
module.exports = {
formatarPreco,
formatarData,
formatarTelefone,
truncarTexto
};