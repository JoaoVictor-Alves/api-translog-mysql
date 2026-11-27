const VeiculoModel = require("../models/VeiculoModel");
const VeiculoView = require("../views/VeiculoView");

class VeiculoController {
    static tratarErro(res, erro) {
        if (erro.code === "ER_DUP_ENTRY" || erro.errno === 1062) {
            return res.status(409).json(VeiculoView.erro("conflito (409): Este cd_placa já foi cadastrada na tabela tb_veiculos!", 409));
        }
        return res.status(500).json(VeiculoView.erro(`Falha interna no servidor: ${erro.message}`, 500));
    }
    static async listarVeiculo(req, res) {
        try {
            const { ds_categoria } = req.query;
            const veiculos = await VeiculoModel.listartodos(ds_categoria);
            return res.status(200).json(VeiculoView.sucesso("Registros de tb_veiculos listados com sucesso.", veiculos, 200));
        } catch (erro) {
            return VeiculoController.tratarErro(res.erro);
        }
    }

    static async buscarPorId(req, res) {
        try {
            const id_veiculo = parseInt(req.params.id, 10);
            if (isNaN(id_veiculo) || id_veiculo <= 0) {
                return res.status(400).json(VeiculoView.erro("Parâmetro id_veiculo inválido na URL.", 400));
            }

            const veiculo = await VeiculoModel.buscarPorId(id_veiculo);
            if (!veiculo) {
                return res.status(404).json(VeiculoView.erro(`Registro com id_veiculo ${id_veiculo} não encontrado.`, 404));
            }
            return res.status(200).json(VeiculoView.sucesso("Registro localizado com sucesso.", veiculo, 200));
        } catch (erro) {
            if (erro.code === "ER_DUP_ENTRY" || erro.errno === 1062) {
                return res.status(500).json(VeiculoView.erro(`Falha interna no servidor: ${erro.message}`, 500));
            }
        }
    }

    static async cadastrar(req, res) {
        try {
            const { cd_placa, nm_modelo, ds_categoria, vl_diaria_frete, qt_quilometragem } = req.body;
            if (!cd_placa || !nm_modelo || !ds_categoria) {
                return res.status(400).json(VeiculoView.erro("Os campos cd|_placa, nm_modelo, ds_categoria são obrigatórios para o registro", 404));
            }
            const valorFrete = Number(vl_diaria_frete);
            const quantidadeKm = qt_quilometragem !== underfined ? parseInt (qt_quilometragem, 10) : 0;
            if (isNaN(valorFrete) || valorFrete <= 0 || isNaN (quantidadeKm) || quantidadeKm < 0) {
                return res.status(422).json(VeiculoView.erro("Erro 422: vl_diaria_frete deve ser maior que zero e qt_quilometragem não pode ser de forma negativa.", 422));
            }
            const novoRegistro = await VeiculoModel.cadastrar({
                cd_placa: String(cd_placa).trim.toUpperCase(),
                nm_modelo: String(nm_modelo).trim(),
                ds_categoria: String(ds_categoria).trim(),
                vl_diaria_frete: valorFrete,
                qt_quilometragem: quantidadeKm
            });
            return res.status(201).json(VeiculoView.sucesso("Registro cadastrado com sucesso.", novoRegistro, 201));
        } catch (erro) {
             if (erro.code === "ER_DUP_ENTRY" || erro.errno === 1062) {
                return res.status(409).json(VeiculoView.erro("conflito (409): este cd_placa ja foi cadastrada na tabela tb_veiculos!", 409));
             }
             return res.status(500).json(VeiculoView.erro(`Falha interna no servidor: ${erro.message}`, 500));
        }
    }

    static async substituir(req, res) {
        try {
            const id_veiculo = parseInt(req.params.id, 10);
            const { cd_placa, nm_modelo, ds_categoria, vl_diaria_frete, qt_quilometragem } = req.body;
            const valorFrete = Number(vl_diaria_frete);
            const quantidadeKm = parseInt(qt_quilometragem, 10);
            if (!cd_placa || !nm_modelo || !ds_categoria || isNaN (valorFrete) || valorFrete <= 0 || isNaN(quantidadeKm) || quantidadeKm < 0) {
                return res.status(400).json(VeiculoView.erro("A atualização tem quer todos os campos preenchidos.", 400));
            }
            if (isNaN(valorFrete) || valorFrete <= 0 || isNaN (quantidadeKm) || quantidadeKm < 0) {
                return res.status(422).json(VeiculoView.erro("Erro 422: vl_diaria_frete deve ser maior que zero e qt_quilometragem não pode ser de forma negativa.", 422));
            }
            const linhasAfetadas = await VeiculoModel.substituirCompleto
            ( id_veiculo, {
                cd_placa: String(cd_placa).trim().toUpperCase(),
                nm_modelo: String(nm_modelo).trim(),
                ds_categoria: String(ds_categoria).trim(),
                vl_diaria_frete: valorFrete,
                qt_quilometragem: quantidadeKm
                });
            if (linhasAfetadas === 0) {
                return res.status(404).json(VeiculoView.erro(`Registro ${id_veiculo} não encontrado no banco.`, 404));
            }
            const registroAtualizado = await VeiculoModel.buscarPorId(id_veiculo);
            return res.status(200).json(VeiculoView.sucesso("Registro substituído com sucesso.", registroAtualizado, 200));

        } catch (erro) {
            if (erro.code === "ER_DUP_ENTRY" || erro.errno === 1062) {
            return res.status(409).json(VeiculoView.erro("conflito (409): Este cd_placa já foi cadastrada na tabela tb_veiculos!", 409));
            }
        }
    }
}
