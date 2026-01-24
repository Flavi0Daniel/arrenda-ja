const express = require('express');
const AutenticacaoControlador = require('../controladores/AutenticacaoControlador');
const { validarRegistro, validarLogin } = require('../middleware/validacao');
const { verificarAutenticacao } = require('../middleware/autenticacao');

const roteador = express.Router();

/**
 * @route   POST /api/autenticacao/registar
 * @desc    Registar novo utilizador
 * @access  Público
 */
roteador.post('/registar', validarRegistro, (req, res) => {
    AutenticacaoControlador.registar(req, res);
});

/**
 * @route   POST /api/autenticacao/entrar
 * @desc    Fazer login
 * @access  Público
 */
roteador.post('/entrar', validarLogin, (req, res) => {
    AutenticacaoControlador.entrar(req, res);
});

/**
 * @route   GET /api/autenticacao/perfil
 * @desc    Obter perfil do utilizador autenticado
 * @access  Privado
 */
roteador.get('/perfil', verificarAutenticacao, (req, res) => {
    AutenticacaoControlador.obterPerfil(req, res);
});

module.exports = roteador;