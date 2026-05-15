const express = require('express');
const EstatisticaControlador = require('../controladores/EstatisticaControlador');
const { verificarAutenticacao, verificarAdministrador, verificarProprietario, verificarArrendatario } = require('../middleware/autenticacao');

const roteador = express.Router();

/**
 * @route   GET /api/estatisticas/administrador
 * @desc    Obter estatísticas gerais (admin)
 * @access  Privado (Administrador)
 */
roteador.get('/administrador', verificarAutenticacao, verificarAdministrador, (req, res) => {
    EstatisticaControlador.obterEstatisticasAdmin(req, res);
});

/**
 * @route   GET /api/estatisticas/proprietario/:id
 * @desc    Obter estatísticas do proprietário
 * @access  Privado (Proprietário - apenas suas próprias estatísticas)
 */
roteador.get('/proprietario/:id', verificarAutenticacao, verificarProprietario, (req, res) => {
    // Verificar se o proprietário está acessando suas próprias estatísticas
    if (parseInt(req.params.id) !== req.utilizador.id) {
        return res.status(403).json({
            sucesso: false,
            mensagem: 'Acesso negado'
        });
    }
    EstatisticaControlador.obterEstatisticasProprietario(req, res);
});

/**
 * @route   GET /api/estatisticas/arrendatario/:id
 * @desc    Obter estatísticas do arrendatário
 * @access  Privado (Arrendatário - apenas suas próprias estatísticas)
 */
roteador.get('/arrendatario/:id', verificarAutenticacao, verificarArrendatario, (req, res) => {
    // Verificar se o arrendatário está acessando suas próprias estatísticas
    if (parseInt(req.params.id) !== req.utilizador.id) {
        return res.status(403).json({
            sucesso: false,
            mensagem: 'Acesso negado'
        });
    }
    EstatisticaControlador.obterEstatisticasArrendatario(req, res);
});

/**
 * @route   GET /api/estatisticas/relatorio-imoveis
 * @desc    Relatório detalhado de imóveis
 * @access  Privado (Administrador)
 */
roteador.get('/relatorio-imoveis', verificarAutenticacao, verificarAdministrador, (req, res) => {
    EstatisticaControlador.obterRelatorioImoveis(req, res);
});

/**
 * @route   GET /api/estatisticas/relatorio-utilizadores
 * @desc    Relatório detalhado de utilizadores
 * @access  Privado (Administrador)
 */
roteador.get('/relatorio-utilizadores', verificarAutenticacao, verificarAdministrador, (req, res) => {
    EstatisticaControlador.obterRelatorioUtilizadores(req, res);
});

/**
 * @route   GET /api/estatisticas/relatorio-financeiro
 * @desc    Relatório financeiro
 * @access  Privado (Administrador)
 */
roteador.get('/relatorio-financeiro', verificarAutenticacao, verificarAdministrador, (req, res) => {
    EstatisticaControlador.obterRelatorioFinanceiro(req, res);
});

module.exports = roteador;