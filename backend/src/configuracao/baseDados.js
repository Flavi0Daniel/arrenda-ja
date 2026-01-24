const mysql = require('mysql2/promise');

const configuracaoBD = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// Criar pool de conexões para melhor performance
const poolConexoes = mysql.createPool(configuracaoBD);

// Testar conexão
poolConexoes.getConnection()
    .then(conexao => {
        console.log('✅ Conectado à base de dados MySQL');
        conexao.release();
    })
    .catch(erro => {
        console.error('❌ Erro ao conectar à base de dados:', erro.message);
    });

module.exports = poolConexoes;