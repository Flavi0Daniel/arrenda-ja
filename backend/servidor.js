require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');

const aplicacao = express();

// =============================
// CONFIGURAÇÕES DE SEGURANÇA
// =============================
aplicacao.use(helmet());

// Configuração do CORS
aplicacao.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:4200',
    credentials: true
}));

// =============================
// MIDDLEWARE DE LOGGING
// =============================
if (process.env.AMBIENTE_NODE === 'development') {
    aplicacao.use(morgan('dev'));
} else {
    aplicacao.use(morgan('combined'));
}

// =============================
// PARSERS
// =============================
aplicacao.use(express.json({ limit: '10mb' }));
aplicacao.use(express.urlencoded({ extended: true, limit: '10mb' }));

// =============================
// ARQUIVOS ESTÁTICOS
// =============================
const pastaUploads = path.join(__dirname, 'uploads');
if (!fs.existsSync(pastaUploads)) {
    fs.mkdirSync(pastaUploads, { recursive: true });
}
aplicacao.use('/uploads', express.static(pastaUploads));

// =============================
// IMPORTAR ROTAS
// =============================
let rotasAutenticacao, rotasImoveis, rotasSolicitacoes, rotasMensagens, rotasCondominios, rotasUtilizadores;

try {
    rotasAutenticacao = require('./src/rotas/autenticacao');
    console.log('✅ Rotas de autenticação carregadas');
} catch (erro) {
    console.warn('⚠️  Rotas de autenticação não encontradas');
}

try {
    rotasImoveis = require('./src/rotas/imoveis');
    console.log('✅ Rotas de imóveis carregadas');
} catch (erro) {
    console.warn('⚠️  Rotas de imóveis não encontradas');
}

try {
    rotasSolicitacoes = require('./src/rotas/solicitacoes');
    console.log('✅ Rotas de solicitações carregadas');
} catch (erro) {
    console.warn('⚠️  Rotas de solicitações não encontradas');
}

try {
    rotasMensagens = require('./src/rotas/mensagens');
    console.log('✅ Rotas de mensagens carregadas');
} catch (erro) {
    console.warn('⚠️  Rotas de mensagens não encontradas');
}

try {
    rotasCondominios = require('./src/rotas/condominios');
    console.log('✅ Rotas de condomínios carregadas');
} catch (erro) {
    console.warn('⚠️  Rotas de condomínios não encontradas');
}

try {
    rotasUtilizadores = require('./src/rotas/utilizadores');
    console.log('✅ Rotas de utilizadores carregadas');
} catch (erro) {
    console.warn('⚠️  Rotas de utilizadores não encontradas');
}

// =============================
// ROTAS DA API
// =============================
if (rotasAutenticacao) aplicacao.use('/api/autenticacao', rotasAutenticacao);
if (rotasImoveis) aplicacao.use('/api/imoveis', rotasImoveis);
if (rotasSolicitacoes) aplicacao.use('/api/solicitacoes', rotasSolicitacoes);
if (rotasMensagens) aplicacao.use('/api/mensagens', rotasMensagens);
if (rotasCondominios) aplicacao.use('/api/condominios', rotasCondominios);
if (rotasUtilizadores) aplicacao.use('/api/utilizadores', rotasUtilizadores);

// Rota de teste
aplicacao.get('/api/status', (req, res) => {
    res.json({
        sucesso: true,
        mensagem: 'API ArrendaJá está funcionando!',
        versao: '1.0.0',
        ambiente: process.env.AMBIENTE_NODE || 'development',
        rotasCarregadas: {
            autenticacao: !!rotasAutenticacao,
            imoveis: !!rotasImoveis,
            solicitacoes: !!rotasSolicitacoes,
            mensagens: !!rotasMensagens,
            condominios: !!rotasCondominios,
            utilizadores: !!rotasUtilizadores
        }
    });
});

// =============================
// TRATAMENTO DE ERROS
// =============================
// Rota não encontrada
aplicacao.use((req, res) => {
    res.status(404).json({
        sucesso: false,
        mensagem: 'Rota não encontrada'
    });
});

// Tratamento de erros
aplicacao.use((erro, req, res, next) => {
    console.error('Erro capturado:', erro);

    // Erro do Multer (upload)
    if (erro.name === 'MulterError') {
        if (erro.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'O arquivo excede o tamanho máximo permitido (5MB)'
            });
        }
        return res.status(400).json({
            sucesso: false,
            mensagem: `Erro no upload: ${erro.message}`
        });
    }

    // Erro de validação de JWT
    if (erro.name === 'JsonWebTokenError') {
        return res.status(401).json({
            sucesso: false,
            mensagem: 'Token inválido'
        });
    }

    // Erro de token expirado
    if (erro.name === 'TokenExpiredError') {
        return res.status(401).json({
            sucesso: false,
            mensagem: 'Token expirado'
        });
    }

    // Erro genérico
    res.status(500).json({
        sucesso: false,
        mensagem: 'Erro interno do servidor',
        ...(process.env.AMBIENTE_NODE === 'development' && { detalhe: erro.message })
    });
});

// =============================
// INICIAR SERVIDOR
// =============================
const PORTA = process.env.PORT || 3000;

aplicacao.listen(PORTA, () => {
    console.log('='.repeat(50));
    console.log(`🚀 Servidor ArrendaJá rodando na porta ${PORTA}`);
    console.log(`📍 Ambiente: ${process.env.AMBIENTE_NODE || 'development'}`);
    console.log(`🌐 URL: http://localhost:${PORTA}`);
    console.log(`📖 API: http://localhost:${PORTA}/api/status`);
    console.log('='.repeat(50));
});

// Tratamento de erros não capturados
process.on('unhandledRejection', (erro) => {
    console.error('❌ Erro não tratado:', erro);
    process.exit(1);
});

process.on('uncaughtException', (erro) => {
    console.error('❌ Exceção não capturada:', erro);
    process.exit(1);
});

module.exports = aplicacao;