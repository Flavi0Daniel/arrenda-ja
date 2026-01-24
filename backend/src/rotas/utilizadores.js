const express = require('express');
const UtilizadorControlador = require('../controladores/UtilizadorControlador');
const { verificarAutenticacao, verificarAdministrador } = require('../middleware/autenticacao');
const { uploadFotoPerfil } = require('../middleware/upload');

const roteador = express.Router();

/**
 * @route   GET /api/utilizadores/perfil
 * @desc    Obter perfil do utilizador autenticado
 * @access  Privado
 */
roteador.get('/perfil', verificarAutenticacao, (req, res) => {
    UtilizadorControlador.obterPerfil(req, res);
});

/**
 * @route   PUT /api/utilizadores/perfil
 * @desc    Atualizar perfil
 * @access  Privado
 */
roteador.put('/perfil', verificarAutenticacao, (req, res) => {
    UtilizadorControlador.atualizarPerfil(req, res);
});

/**
 * @route   PATCH /api/utilizadores/alterar-senha
 * @desc    Alterar senha
 * @access  Privado
 */
roteador.patch('/alterar-senha', verificarAutenticacao, (req, res) => {
    UtilizadorControlador.alterarSenha(req, res);
});

/**
 * @route   GET /api/utilizadores
 * @desc    Listar todos os utilizadores
 * @access  Privado (Administrador)
 */
roteador.get('/', verificarAutenticacao, verificarAdministrador, (req, res) => {
    UtilizadorControlador.listar(req, res);
});

/**
 * @route   DELETE /api/utilizadores/:id
 * @desc    Desativar utilizador
 * @access  Privado (Administrador)
 */
roteador.delete('/:id', verificarAutenticacao, verificarAdministrador, (req, res) => {
    UtilizadorControlador.desativar(req, res);
});

module.exports = roteador;