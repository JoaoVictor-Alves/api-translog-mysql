const express = require("express");
const VeiculoController = require("../controllers/VeiculoController");

const router = express.Router();

router.get("/veiculos", VeiculoController.listar);
router.get("/veiculos/:id", VeiculoController.buscarPorId);
router.post('/veiculos', VeiculoController.cadastrar);

module.exports = router;

// ana liz