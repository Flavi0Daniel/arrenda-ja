const express = require('express');
const MensagemControlador = require('../controladores/MensagemControlador');
const { verificarAutenticacao } = require('../middleware/autenticacao');

const roteador = express.Router();

/**
 * @route   POST /api/mensagens
 * @desc    Enviar nova mensagem
 * @access  Privado
 */
roteador.post('/', verificarAutenticacao, (req, res) => {
    MensagemControlador.enviar(req, res);
});

/**
 * @route   GET /api/mensagens/recebidas
 * @desc    Listar mensagens recebidas
 * @access  Privado
 */
roteador.get('/recebidas', verificarAutenticacao, (req, res) => {
    MensagemControlador.listarRecebidas(req, res);
});

/**
 * @route   GET /api/mensagens/enviadas
 * @desc    Listar mensagens enviadas
 * @access  Privado
 */
roteador.get('/enviadas', verificarAutenticacao, (req, res) => {
    MensagemControlador.listarEnviadas(req, res);
});

/**
 * @route   GET /api/mensagens/nao-lidas/contar
 * @desc    Contar mensagens não lidas
 * @access  Privado
 */
roteador.get('/nao-lidas/contar', verificarAutenticacao, (req, res) => {
    MensagemControlador.contarNaoLidas(req, res);
});

/**
 * @route   GET /api/mensagens/conversa/:utilizadorId
 * @desc    Obter conversa com outro utilizador
 * @access  Privado
 */
roteador.get('/conversa/:utilizadorId', verificarAutenticacao, (req, res) => {
    MensagemControlador.obterConversa(req, res);
});

/**
 * @route   GET /api/mensagens/:id
 * @desc    Ler mensagem específica
 * @access  Privado
 */
roteador.get('/:id', verificarAutenticacao, (req, res) => {
    MensagemControlador.ler(req, res);
});

module.exports = roteador;