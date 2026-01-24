const ImovelRepositorio = require('../repositorios/ImovelRepositorio');
const UtilizadorRepositorio = require('../repositorios/UtilizadorRepositorio');
const CondominioRepositorio = require('../repositorios/CondominioRepositorio');

/**
 * Serviço para gestão de imóveis
 */
class ImovelServico {
    /**
     * Criar novo imóvel
     */
    async criar(dadosImovel, proprietarioId) {
        // Verificar se o utilizador é proprietário
        const proprietario = await UtilizadorRepositorio.buscarPorId(proprietarioId);
        
        if (!proprietario || !proprietario.eProprietario()) {
            throw new Error('Apenas proprietários podem publicar imóveis');
        }

        // Verificar se o condomínio existe
        const condominio = await CondominioRepositorio.buscarPorId(dadosImovel.condominioId);
        
        if (!condominio) {
            throw new Error('Condomínio não encontrado');
        }

        // Validar dados obrigatórios
        this.validarDadosImovel(dadosImovel);

        // Criar imóvel com status 'em_analise'
        const novoImovel = await ImovelRepositorio.criar({
            ...dadosImovel,
            proprietarioId,
            status: 'em_analise'
        });

        return novoImovel;
    }

    /**
     * Adicionar fotos ao imóvel
     */
    async adicionarFotos(imovelId, arquivos, proprietarioId) {
        // Verificar se o imóvel existe e pertence ao proprietário
        const imovel = await ImovelRepositorio.buscarPorId(imovelId);
        
        if (!imovel) {
            throw new Error('Imóvel não encontrado');
        }

        if (imovel.proprietarioId !== proprietarioId) {
            throw new Error('Você não tem permissão para adicionar fotos a este imóvel');
        }

        // Adicionar cada foto
        const fotosAdicionadas = [];
        for (let i = 0; i < arquivos.length; i++) {
            const ePrincipal = i === 0; // Primeira foto é a principal
            const fotoId = await ImovelRepositorio.adicionarFoto(
                imovelId,
                arquivos[i].path,
                ePrincipal
            );
            fotosAdicionadas.push(fotoId);
        }

        return fotosAdicionadas;
    }

    /**
     * Pesquisar imóveis com filtros
     */
    async pesquisar(filtros, pagina, itensPorPagina) {
        const imoveis = await ImovelRepositorio.pesquisar(filtros, pagina, itensPorPagina);
        
        // Adicionar foto principal a cada imóvel
        for (const imovel of imoveis) {
            const fotos = await ImovelRepositorio.buscarFotos(imovel.id);
            imovel.fotoPrincipal = fotos.find(f => f.e_principal)?.caminho_arquivo || null;
        }

        return imoveis;
    }

    /**
     * Obter detalhes completos do imóvel
     */
    async obterDetalhes(imovelId, utilizadorId = null, enderecoIp) {
        const imovel = await ImovelRepositorio.buscarPorId(imovelId);
        
        if (!imovel) {
            throw new Error('Imóvel não encontrado');
        }

        // Registrar visualização
        await ImovelRepositorio.registrarVisualizacao(imovelId, utilizadorId, enderecoIp);

        // Contar total de visualizações
        imovel.totalVisualizacoes = await ImovelRepositorio.contarVisualizacoes(imovelId);

        return imovel;
    }

    /**
     * Listar imóveis do proprietário
     */
    async listarMeusImoveis(proprietarioId) {
        return await ImovelRepositorio.listarPorProprietario(proprietarioId);
    }

    /**
     * Atualizar imóvel
     */
    async atualizar(imovelId, dadosAtualizacao, proprietarioId) {
        const imovel = await ImovelRepositorio.buscarPorId(imovelId);
        
        if (!imovel) {
            throw new Error('Imóvel não encontrado');
        }

        if (imovel.proprietarioId !== proprietarioId) {
            throw new Error('Você não tem permissão para editar este imóvel');
        }

        return await ImovelRepositorio.atualizar(imovelId, dadosAtualizacao);
    }

    /**
     * Alterar status do imóvel (admin)
     */
    async alterarStatus(imovelId, novoStatus, utilizadorId) {
        const utilizador = await UtilizadorRepositorio.buscarPorId(utilizadorId);
        
        if (!utilizador || !utilizador.eAdministrador()) {
            throw new Error('Apenas administradores podem alterar o status de imóveis');
        }

        const statusPermitidos = ['disponivel', 'arrendado', 'em_analise', 'inativo'];
        if (!statusPermitidos.includes(novoStatus)) {
            throw new Error('Status inválido');
        }

        return await ImovelRepositorio.atualizarStatus(imovelId, novoStatus);
    }

    /**
     * Marcar imóvel como arrendado
     */
    async marcarComoArrendado(imovelId, proprietarioId) {
        const imovel = await ImovelRepositorio.buscarPorId(imovelId);
        
        if (!imovel) {
            throw new Error('Imóvel não encontrado');
        }

        if (imovel.proprietarioId !== proprietarioId) {
            throw new Error('Você não tem permissão para alterar este imóvel');
        }

        return await ImovelRepositorio.atualizarStatus(imovelId, 'arrendado');
    }

    /**
     * Validar dados do imóvel
     */
    validarDadosImovel(dados) {
        if (!dados.titulo || dados.titulo.trim().length < 10) {
            throw new Error('O título deve ter pelo menos 10 caracteres');
        }

        if (!dados.descricao || dados.descricao.trim().length < 50) {
            throw new Error('A descrição deve ter pelo menos 50 caracteres');
        }

        if (!dados.tipologia) {
            throw new Error('A tipologia é obrigatória');
        }

        if (!dados.precoMensal || dados.precoMensal <= 0) {
            throw new Error('O preço mensal deve ser maior que zero');
        }

        const tipologiasValidas = ['T0', 'T1', 'T2', 'T3', 'T4', 'T5+'];
        if (!tipologiasValidas.includes(dados.tipologia)) {
            throw new Error('Tipologia inválida');
        }
    }
}

module.exports = new ImovelServico();