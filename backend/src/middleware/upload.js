const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Criar pasta de uploads se não existir
const pastaUploads = path.join(__dirname, '../../uploads/imoveis');
if (!fs.existsSync(pastaUploads)) {
    fs.mkdirSync(pastaUploads, { recursive: true });
}

// Configuração do armazenamento
const armazenamento = multer.diskStorage({
    destination: (req, arquivo, callback) => {
        callback(null, pastaUploads);
    },
    filename: (req, arquivo, callback) => {
        // Gerar nome único para o arquivo
        const nomeUnico = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(arquivo.originalname)}`;
        callback(null, nomeUnico);
    }
});

// Filtro de arquivos (apenas imagens)
const filtroArquivos = (req, arquivo, callback) => {
    const tiposPermitidos = /jpeg|jpg|png|webp/;
    const extensaoValida = tiposPermitidos.test(path.extname(arquivo.originalname).toLowerCase());
    const mimetypeValido = tiposPermitidos.test(arquivo.mimetype);

    if (extensaoValida && mimetypeValido) {
        callback(null, true);
    } else {
        callback(new Error('Apenas imagens (JPEG, JPG, PNG, WEBP) são permitidas'));
    }
};

// Configuração do multer
const configuracaoUpload = multer({
    storage: armazenamento,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB por arquivo
    },
    fileFilter: filtroArquivos
});

/**
 * Middleware para upload de múltiplas fotos de imóveis
 * Permite até 10 fotos por vez
 */
const uploadFotosImoveis = configuracaoUpload.array('fotos', 10);

/**
 * Middleware para upload de foto de perfil
 */
const uploadFotoPerfil = configuracaoUpload.single('fotoPerfil');

module.exports = {
    uploadFotosImoveis,
    uploadFotoPerfil
};