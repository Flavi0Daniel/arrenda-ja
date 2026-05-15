const express = require('express');
const ImovelControlador = require('../controladores/ImovelControlador');
const { verificarAutenticacao, verificarProprietario, verificarAdministrador, autenticacaoOpcional } = require('../middleware/autenticacao');
const { validarImovel } = require('../middleware/validacao');
const { uploadFotosImoveis } = require('../middleware/upload');

const roteador = express.Router();

/**
 * @route   GET /api/imoveis/pesquisar
 * @desc    Pesquisar imóveis com filtros
 * @access  Público
 */
roteador.get('/pesquisar', (req, res) => {
    ImovelControlador.pesquisar(req, res);
});

/**
 * @route   GET /api/imoveis/meus
 * @desc    Listar imóveis do proprietário autenticado
 * @access  Privado (Proprietário)
 */
roteador.get('/meus', verificarAutenticacao, verificarProprietario, (req, res) => {
    ImovelControlador.listarMeus(req, res);
});


/**
 * @route   GET /api/imoveis/admin/todos
 * @desc    Listar todos os imóveis (admin)
 * @access  Privado (Administrador)
 */
roteador.get('/admin/todos', verificarAutenticacao, verificarAdministrador, (req, res) => {
    ImovelControlador.listarTodos(req, res);
});


/**
 * @route   GET /api/imoveis/:id
 * @desc    Obter detalhes de um imóvel
 * @access  Público (registra visualização se autenticado)
 */
roteador.get('/:id', autenticacaoOpcional, (req, res) => {
    ImovelControlador.obterDetalhes(req, res);
});

/**
 * @route   POST /api/imoveis
 * @desc    Criar novo imóvel
 * @access  Privado (Proprietário)
 */
roteador.post('/', verificarAutenticacao, verificarProprietario, validarImovel, (req, res) => {
    ImovelControlador.criar(req, res);
});

/**
 * @route   POST /api/imoveis/:id/fotos
 * @desc    Adicionar fotos ao imóvel
 * @access  Privado (Proprietário)
 */
roteador.post('/:id/fotos', verificarAutenticacao, verificarProprietario, uploadFotosImoveis, (req, res) => {
    ImovelControlador.adicionarFotos(req, res);
});

/**
 * @route   PUT /api/imoveis/:id
 * @desc    Atualizar imóvel
 * @access  Privado (Proprietário - apenas seus imóveis)
 */
roteador.put('/:id', verificarAutenticacao, verificarProprietario, (req, res) => {
    ImovelControlador.atualizar(req, res);
});

/**
 * @route   PATCH /api/imoveis/:id/meu-status
 * @desc    Alterar status do próprio imóvel (proprietário)
 * @access  Privado (Proprietário - apenas seus imóveis)
 */
roteador.patch('/:id/meu-status', verificarAutenticacao, verificarProprietario, (req, res) => {
    ImovelControlador.alterarMeuStatus(req, res);
});

/**
 * @route   PATCH /api/imoveis/:id/status
 * @desc    Alterar status do imóvel
 * @access  Privado (Administrador)
 */
roteador.patch('/:id/status', verificarAutenticacao, verificarAdministrador, (req, res) => {
    ImovelControlador.alterarStatus(req, res);
});

/**
 * @route   PATCH /api/imoveis/:id/arrendado
 * @desc    Marcar imóvel como arrendado
 * @access  Privado (Proprietário - apenas seus imóveis)
 */
roteador.patch('/:id/arrendado', verificarAutenticacao, verificarProprietario, (req, res) => {
    ImovelControlador.marcarComoArrendado(req, res);
});

/**
 * @route   DELETE /api/imoveis/:id/fotos/:fotoId
 * @desc    Remover foto do imóvel
 * @access  Privado (Proprietário - apenas seus imóveis)
 */
roteador.delete('/:id/fotos/:fotoId', verificarAutenticacao, verificarProprietario, (req, res) => {
    ImovelControlador.removerFoto(req, res);
});

module.exports = roteador;