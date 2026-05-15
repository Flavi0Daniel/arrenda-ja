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
 * CORRIGIDO: Adiciona o caminho relativo ao req.files
 */
const uploadFotosImoveis = (req, res, next) => {
    configuracaoUpload.array('fotos', 10)(req, res, (erro) => {
        if (erro) {
            return next(erro);
        }
        
        // Corrigir os caminhos dos arquivos para usar caminhos relativos
        if (req.files && req.files.length > 0) {
            req.files = req.files.map(file => ({
                ...file,
                // Substituir o caminho absoluto pelo relativo
                path: `uploads/imoveis/${file.filename}`
            }));
        }
        
        next();
    });
};

/**
 * Middleware para upload de foto de perfil
 */
const uploadFotoPerfil = (req, res, next) => {
    configuracaoUpload.single('fotoPerfil')(req, res, (erro) => {
        if (erro) {
            return next(erro);
        }
        
        // Corrigir o caminho do arquivo para usar caminho relativo
        if (req.file) {
            req.file.path = `uploads/perfis/${req.file.filename}`;
        }
        
        next();
    });
};

module.exports = {
    uploadFotosImoveis,
    uploadFotoPerfil
};