const multer = require('multer');
const path = require('path');

/**
 * Configuração centralizada do Multer para uploads
 */
const configuracaoMulter = {
    // Tamanho máximo do arquivo (5MB)
    tamanhoMaximo: 5 * 1024 * 1024,
    
    // Tipos de arquivo permitidos
    tiposPermitidos: {
        imagens: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
        documentos: ['application/pdf']
    },
    
    // Pastas de destino
    pastas: {
        imoveis: 'uploads/imoveis',
        perfis: 'uploads/perfis',
        documentos: 'uploads/documentos'
    }
};

module.exports = configuracaoMulter;