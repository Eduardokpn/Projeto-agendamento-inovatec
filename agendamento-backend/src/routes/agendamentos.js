// IMPORTS
const express = require('express')
const router = express.Router()
const controller = require('../controllers/agendamentosController')

// ROUTES

// POST /api/agendamentos → create a new booking
router.post('/', controller.criarAgendamento)

// PATCH /api/agendamentos/:id/cancelar → cancel a booking
router.patch('/:id/cancelar', controller.cancelarAgendamento)

// PATCH /api/agendamentos/:id/falta → mark a booking as absence
// Body: { justificativa? }
router.patch('/:id/falta', controller.marcarFalta)

// PATCH /api/agendamentos/:id/realizado → mark a booking as completed
router.patch('/:id/realizado', controller.marcarRealizado)

// EXPORTS
module.exports = router