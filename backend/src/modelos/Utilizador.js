/**
 * Classe que representa um utilizador do sistema
 * Pode ser proprietário, arrendatário ou administrador
 */
class Utilizador {
    constructor(dados) {
        this.id = dados.id;
        this.nomeCompleto = dados.nome_completo;
        this.email = dados.email;
        this.senha = dados.senha;
        this.telefone = dados.telefone;
        this.tipoUtilizador = dados.tipo_utilizador;
        this.fotoPerfil = dados.foto_perfil;
        this.estaAtivo = dados.esta_ativo !== undefined ? dados.esta_ativo : true;
        this.dataCriacao = dados.data_criacao;
        this.dataAtualizacao = dados.data_atualizacao;
    }

    /**
     * Retorna os dados do utilizador sem a senha
     * Para enviar ao frontend com segurança
     */
    paraSemSenha() {
        const { senha, ...utilizadorSemSenha } = this;
        return utilizadorSemSenha;
    }

    /**
     * Verifica se o utilizador é proprietário
     */
    eProprietario() {
        return this.tipoUtilizador === 'proprietario';
    }

    /**
     * Verifica se o utilizador é arrendatário
     */
    eArrendatario() {
        return this.tipoUtilizador === 'arrendatario';
    }

    /**
     * Verifica se o utilizador é administrador
     */
    eAdministrador() {
        return this.tipoUtilizador === 'administrador';
    }
}

module.exports = Utilizador;