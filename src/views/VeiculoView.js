class VeiculoView {
    // Resposta de sucesso (código padrão 200)
    static sucesso(mensagem, dados, statusHttp = 200) {
        return { status: "Sucesso", codigoHttp: statusHttp, mensagem: mensagem, dados: dados };
    }

    // Resposta de erro: classifica a família 4xx (cliente) ou 5xx (servidor)
    static erro(mensagem, dados, statusHttp = 400) {
        return { statusHttp: statusHttp >= 500 ? "erro critico do servidor (5xx)" : "erro cliente (4xx)", codigoHttp: statusHttp, mensagem: mensagem };
    }
}

module.exports = VeiculoView;

//ana liz