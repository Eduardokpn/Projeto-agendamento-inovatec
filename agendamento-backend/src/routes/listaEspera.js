// IMPORTS
const express = require('express')
const router = express.Router()
const controller = require('../controllers/listaEsperaController')

// ROUTES
// GET /api/lista-espera?alunoId=X → get waiting list entries for a student
router.get('/', controller.buscarListaEspera)

// POST /api/lista-espera → join the waiting list
router.post('/', controller.entrarListaEspera)

// DELETE /api/lista-espera/:id → leave the waiting list
router.delete('/:id', controller.sairListaEspera)

// EXPORTS
module.exports = router
