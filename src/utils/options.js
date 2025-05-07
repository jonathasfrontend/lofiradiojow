const shoukakuOptions = {
    moveOnDisconnect: true,   // Tenta mover o player se desconectar
    resumable: true,          // Permite resumir a sessão após desconexão
    resumableTimeout: 60,     // 60 segundos para tentar resumir
    reconnectTries: 5,        // 5 tentativas de reconexão
    restTimeout: 15000        // 15 segundos de timeout para requisições REST
};

module.exports = { shoukakuOptions };