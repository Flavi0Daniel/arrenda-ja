const bd = require('../configuracao/baseDados');

/**
 * Repositório para gestão de condomínios
 */
class CondominioRepositorio {
    /**
     * Criar novo condomínio
     */
    async criar(dadosCondominio) {
        const [resultado] = await bd.execute(`
            INSERT INTO condominios (nome, provincia, municipio, bairro, endereco_completo, descricao)
            VALUES (?, ?, ?, ?, ?, ?)
        `, [
            dadosCondominio.nome,
            dadosCondominio.provincia,
            dadosCondominio.municipio,
            dadosCondominio.bairro,
            dadosCondominio.enderecoCompleto,
            dadosCondominio.descricao
        ]);

        return this.buscarPorId(resultado.insertId);
    }

    /**
     * Buscar condomínio por ID
     */
    async buscarPorId(id) {
        const [linhas] = await bd.execute(
            'SELECT * FROM condominios WHERE id = ?',
            [id]
        );
        return linhas.length > 0 ? linhas[0] : null;
    }

    /**
     * Listar todos os condomínios
     */
    async listarTodos() {
        const [linhas] = await bd.execute(
            'SELECT * FROM condominios ORDER BY nome ASC'
        );
        return linhas;
    }

    /**
     * Buscar condomínios por província
     */
    async buscarPorProvincia(provincia) {
        const [linhas] = await bd.execute(
            'SELECT * FROM condominios WHERE provincia = ? ORDER BY nome ASC',
            [provincia]
        );
        return linhas;
    }

    /**
     * Buscar condomínios por município
     */
    async buscarPorMunicipio(municipio) {
        const [linhas] = await bd.execute(
            'SELECT * FROM condominios WHERE municipio = ? ORDER BY nome ASC',
            [municipio]
        );
        return linhas;
    }

    /**
     * Obter lista de províncias únicas
     */
    async obterProvincias() {
        const [linhas] = await bd.execute(
            'SELECT DISTINCT provincia FROM condominios ORDER BY provincia ASC'
        );
        return linhas.map(linha => linha.provincia);
    }

    /**
     * Obter lista de municípios por província
     */
    async obterMunicipiosPorProvincia(provincia) {
        const [linhas] = await bd.execute(
            'SELECT DISTINCT municipio FROM condominios WHERE provincia = ? ORDER BY municipio ASC',
            [provincia]
        );
        return linhas.map(linha => linha.municipio);
    }
}

module.exports = new CondominioRepositorio();