const express = require('express');
const SolicitacaoControlador = require('../controladores/SolicitacaoControlador');
const { verificarAutenticacao, verificarArrendatario, verificarProprietario } = require('../middleware/autenticacao');
const { validarSolicitacao } = require('../middleware/validacao');

const roteador = express.Router();

/**
 * @route   POST /api/solicitacoes
 * @desc    Criar nova solicitação de arrendamento
 * @access  Privado (Arrendatário)
 */
roteador.post('/', verificarAutenticacao, verificarArrendatario, validarSolicitacao, (req, res) => {
    SolicitacaoControlador.criar(req, res);
});

/**
 * @route   GET /api/solicitacoes/recebidas
 * @desc    Listar solicitações recebidas
 * @access  Privado (Proprietário)
 */
roteador.get('/recebidas', verificarAutenticacao, verificarProprietario, (req, res) => {
    SolicitacaoControlador.listarRecebidas(req, res);
});

/**
 * @route   GET /api/solicitacoes/enviadas
 * @desc    Listar solicitações enviadas
 * @access  Privado (Arrendatário)
 */
roteador.get('/enviadas', verificarAutenticacao, verificarArrendatario, (req, res) => {
    SolicitacaoControlador.listarEnviadas(req, res);
});

/**
 * @route   GET /api/solicitacoes/pendentes/contar
 * @desc    Contar solicitações pendentes
 * @access  Privado (Proprietário)
 */
roteador.get('/pendentes/contar', verificarAutenticacao, verificarProprietario, (req, res) => {
    SolicitacaoControlador.contarPendentes(req, res);
});

/**
 * @route   PATCH /api/solicitacoes/:id/responder
 * @desc    Responder a uma solicitação (aceitar/recusar)
 * @access  Privado (Proprietário)
 */
roteador.patch('/:id/responder', verificarAutenticacao, verificarProprietario, (req, res) => {
    SolicitacaoControlador.responder(req, res);
});

/**
 * @route   PATCH /api/solicitacoes/:id/cancelar
 * @desc    Cancelar solicitação
 * @access  Privado (Arrendatário)
 */
roteador.patch('/:id/cancelar', verificarAutenticacao, verificarArrendatario, (req, res) => {
    SolicitacaoControlador.cancelar(req, res);
});

module.exports = roteador;