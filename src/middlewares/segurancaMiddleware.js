const validarHeadersJson = (req, res, next) => {

    const accept = req.headers["accept"] || "*/*";

    if(!accept.includes("application/json") && !accept.includes("*/*")) {
        return res.status(406).json({status: "Erro 406", mensagem: "Não foi possível processar a solicitação."});
    }
    if(!contentType.includes("application/json")) {
        return res.status(415).json({status: "Erro 415", mensagem:"Tipo de mídia não suportado."});
    }
    next();
};

const verificarToken = (req, res, next) => {

    const authHeader = req.headers["authorization"] || "";
    if(authHeader !== `Bearer ${process.env.API_TOKEN}`) {
        return res.status(401).json({status: "Erro 401", mensagem: "Acesso negado: Token Inválido!"});
    }
    next();
};
module.exports = { validarHeadersJson, verificarToken};