const CondominioRepositorio = require('../repositorios/CondominioRepositorio');

/**
 * Controlador para gestão de condomínios
 */
class CondominioControlador {
    /**
     * GET /api/condominios
     * Listar todos os condomínios
     */
    async listarTodos(req, res) {
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
    }

    /**
     * GET /api/condominios/:id
     * Obter detalhes de um condomínio
     */
    async obterPorId(req, res) {
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
    }

    /**
     * POST /api/condominios
     * Criar novo condomínio
     */
    async criar(req, res) {
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
    }

    /**
     * GET /api/condominios/provincias
     * Obter lista de províncias
     */
    async obterProvincias(req, res) {
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
    }

    /**
     * GET /api/condominios/municipios/:provincia
     * Obter municípios por província
     */
    async obterMunicipios(req, res) {
        try {
            const municipios = await CondominioRepositorio.obterMunicipiosPorProvincia(
                req.params.provincia
            );
            
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
    }
}

module.exports = new CondominioControlador();