const VeiculoModel = require("../models/VeiculoModel");
const VeiculoView = require("../views/VeiculoView");

class VeiculoController {
    static tratarErro(res, erro) {
        if (erro.code === "ER_DUP_ENTRY" || erro.errno === 1062) {
            return res.status(409).json(VeiculoView.erro("conflito (409): Este cd_placa já foi cadastrado na tabela tb_veiculos!", 409));
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
}
