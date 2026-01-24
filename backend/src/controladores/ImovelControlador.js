const ImovelServico = require('../servicos/ImovelServico');

/**
 * Controlador para gestão de imóveis
 */
class ImovelControlador {
    /**
     * POST /api/imoveis
     * Criar novo imóvel
     */
    async criar(req, res) {
        try {
            const proprietarioId = req.utilizador.id;
            const novoImovel = await ImovelServico.criar(req.body, proprietarioId);
            
            res.status(201).json({
                sucesso: true,
                mensagem: 'Imóvel criado com sucesso. Aguarde aprovação do administrador.',
                dados: novoImovel
            });
        } catch (erro) {
            res.status(400).json({
                sucesso: false,
                mensagem: erro.message
            });
        }
    }

    /**
     * POST /api/imoveis/:id/fotos
     * Adicionar fotos ao imóvel
     */
    async adicionarFotos(req, res) {
        try {
            const imovelId = parseInt(req.params.id);
            const proprietarioId = req.utilizador.id;
            
            if (!req.files || req.files.length === 0) {
                return res.status(400).json({
                    sucesso: false,
                    mensagem: 'Nenhuma foto foi enviada'
                });
            }

            const fotos = await ImovelServico.adicionarFotos(
                imovelId,
                req.files,
                proprietarioId
            );
            
            res.json({
                sucesso: true,
                mensagem: 'Fotos adicionadas com sucesso',
                dados: { fotosAdicionadas: fotos.length }
            });
        } catch (erro) {
            res.status(400).json({
                sucesso: false,
                mensagem: erro.message
            });
        }
    }

    /**
     * GET /api/imoveis/pesquisar
     * Pesquisar imóveis com filtros
     */
    async pesquisar(req, res) {
        try {
            const filtros = {
                tipologia: req.query.tipologia,
                precoMinimo: req.query.precoMinimo ? parseFloat(req.query.precoMinimo) : null,
                precoMaximo: req.query.precoMaximo ? parseFloat(req.query.precoMaximo) : null,
                provincia: req.query.provincia,
                municipio: req.query.municipio,
                bairro: req.query.bairro,
                temGaragem: req.query.temGaragem === 'true',
                temPiscina: req.query.temPiscina === 'true',
                estaMobilado: req.query.estaMobilado === 'true'
            };

            // Remover filtros vazios
            Object.keys(filtros).forEach(chave => {
                if (filtros[chave] === null || filtros[chave] === undefined) {
                    delete filtros[chave];
                }
            });

            const pagina = parseInt(req.query.pagina) || 1;
            const itensPorPagina = parseInt(req.query.itensPorPagina) || 12;

            const imoveis = await ImovelServico.pesquisar(filtros, pagina, itensPorPagina);
            
            res.json({
                sucesso: true,
                dados: {
                    imoveis,
                    pagina,
                    itensPorPagina
                }
            });
        } catch (erro) {
            res.status(400).json({
                sucesso: false,
                mensagem: erro.message
            });
        }
    }

    /**
     * GET /api/imoveis/:id
     * Obter detalhes de um imóvel
     */
    async obterDetalhes(req, res) {
        try {
            const imovelId = parseInt(req.params.id);
            const utilizadorId = req.utilizador ? req.utilizador.id : null;
            const enderecoIp = req.ip || req.connection.remoteAddress;

            const imovel = await ImovelServico.obterDetalhes(imovelId, utilizadorId, enderecoIp);
            
            res.json({
                sucesso: true,
                dados: imovel
            });
        } catch (erro) {
            res.status(404).json({
                sucesso: false,
                mensagem: erro.message
            });
        }
    }

    /**
     * GET /api/imoveis/meus
     * Listar imóveis do proprietário
     */
    async listarMeus(req, res) {
        try {
            const proprietarioId = req.utilizador.id;
            const imoveis = await ImovelServico.listarMeusImoveis(proprietarioId);
            
            res.json({
                sucesso: true,
                dados: imoveis
            });
        } catch (erro) {
            res.status(400).json({
                sucesso: false,
                mensagem: erro.message
            });
        }
    }

    /**
     * PUT /api/imoveis/:id
     * Atualizar imóvel
     */
    async atualizar(req, res) {
        try {
            const imovelId = parseInt(req.params.id);
            const proprietarioId = req.utilizador.id;

            const imovelAtualizado = await ImovelServico.atualizar(
                imovelId,
                req.body,
                proprietarioId
            );
            
            res.json({
                sucesso: true,
                mensagem: 'Imóvel atualizado com sucesso',
                dados: imovelAtualizado
            });
        } catch (erro) {
            res.status(400).json({
                sucesso: false,
                mensagem: erro.message
            });
        }
    }

    /**
     * PATCH /api/imoveis/:id/status
     * Alterar status do imóvel (admin)
     */
    async alterarStatus(req, res) {
        try {
            const imovelId = parseInt(req.params.id);
            const { status } = req.body;
            const utilizadorId = req.utilizador.id;

            const imovelAtualizado = await ImovelServico.alterarStatus(
                imovelId,
                status,
                utilizadorId
            );
            
            res.json({
                sucesso: true,
                mensagem: 'Status do imóvel atualizado',
                dados: imovelAtualizado
            });
        } catch (erro) {
            res.status(400).json({
                sucesso: false,
                mensagem: erro.message
            });
        }
    }

    /**
     * PATCH /api/imoveis/:id/arrendado
     * Marcar imóvel como arrendado
     */
    async marcarComoArrendado(req, res) {
        try {
            const imovelId = parseInt(req.params.id);
            const proprietarioId = req.utilizador.id;

            const imovel = await ImovelServico.marcarComoArrendado(imovelId, proprietarioId);
            
            res.json({
                sucesso: true,
                mensagem: 'Imóvel marcado como arrendado',
                dados: imovel
            });
        } catch (erro) {
            res.status(400).json({
                sucesso: false,
                mensagem: erro.message
            });
        }
    }
}

module.exports = new ImovelControlador();