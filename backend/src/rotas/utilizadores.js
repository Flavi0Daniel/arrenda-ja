const express = require('express');
const UtilizadorControlador = require('../controladores/UtilizadorControlador');
const { verificarAutenticacao, verificarAdministrador } = require('../middleware/autenticacao');
const { uploadFotoPerfil } = require('../middleware/upload');

const roteador = express.Router();

/**
 * @route   POST /api/utilizadores/perfil/foto
 * @desc    Upload de foto de perfil
 * @access  Privado
 */
roteador.post('/perfil/foto', verificarAutenticacao, uploadFotoPerfil, (req, res) => {
    UtilizadorControlador.uploadFotoPerfil(req, res);
});

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
 * @route   POST /api/utilizadores
 * @desc    Criar novo utilizador (admin)
 * @access  Privado (Administrador)
 */
roteador.post('/', verificarAutenticacao, verificarAdministrador, (req, res) => {
    UtilizadorControlador.criar(req, res);
});

/**
 * @route   PUT /api/utilizadores/:id
 * @desc    Editar utilizador (admin)
 * @access  Privado (Administrador)
 */
roteador.put('/:id', verificarAutenticacao, verificarAdministrador, (req, res) => {
    UtilizadorControlador.editar(req, res);
});

/**
 * @route   PATCH /api/utilizadores/:id/reativar
 * @desc    Reativar utilizador desativado
 * @access  Privado (Administrador)
 */
roteador.patch('/:id/reativar', verificarAutenticacao, verificarAdministrador, (req, res) => {
    UtilizadorControlador.reativar(req, res);
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