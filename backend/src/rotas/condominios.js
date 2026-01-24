const express = require('express');
const CondominioRepositorio = require('../repositorios/CondominioRepositorio');
const { verificarAutenticacao, verificarAdministrador } = require('../middleware/autenticacao');

const roteador = express.Router();

/**
 * @route   GET /api/condominios
 * @desc    Listar todos os condomínios
 * @access  Público
 */
roteador.get('/', async (req, res) => {
    try {
        const condominios = await CondominioRepositorio.listarTodos();
        res.json({
            sucesso: true,
            dados: condominios
        });
    } catch (erro) {
        res.status(400).json({
            sucesso: false,
            mensagem: erro.message
        });
    }
});

/**
 * @route   GET /api/condominios/provincias
 * @desc    Obter lista de províncias
 * @access  Público
 */
roteador.get('/provincias', async (req, res) => {
    try {
        const provincias = await CondominioRepositorio.obterProvincias();
        res.json({
            sucesso: true,
            dados: provincias
        });
    } catch (erro) {
        res.status(400).json({
            sucesso: false,
            mensagem: erro.message
        });
    }
});

/**
 * @route   GET /api/condominios/municipios/:provincia
 * @desc    Obter municípios por província
 * @access  Público
 */
roteador.get('/municipios/:provincia', async (req, res) => {
    try {
        const municipios = await CondominioRepositorio.obterMunicipiosPorProvincia(req.params.provincia);
        res.json({
            sucesso: true,
            dados: municipios
        });
    } catch (erro) {
        res.status(400).json({
            sucesso: false,
            mensagem: erro.message
        });
    }
});

/**
 * @route   GET /api/condominios/:id
 * @desc    Obter detalhes de um condomínio
 * @access  Público
 */
roteador.get('/:id', async (req, res) => {
    try {
        const condominio = await CondominioRepositorio.buscarPorId(req.params.id);
        if (!condominio) {
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Condomínio não encontrado'
            });
        }
        res.json({
            sucesso: true,
            dados: condominio
        });
    } catch (erro) {
        res.status(400).json({
            sucesso: false,
            mensagem: erro.message
        });
    }
});

/**
 * @route   POST /api/condominios
 * @desc    Criar novo condomínio
 * @access  Privado (Administrador)
 */
roteador.post('/', verificarAutenticacao, verificarAdministrador, async (req, res) => {
    try {
        const novoCondominio = await CondominioRepositorio.criar(req.body);
        res.status(201).json({
            sucesso: true,
            mensagem: 'Condomínio criado com sucesso',
            dados: novoCondominio
        });
    } catch (erro) {
        res.status(400).json({
            sucesso: false,
            mensagem: erro.message
        });
    }
});

module.exports = roteador;