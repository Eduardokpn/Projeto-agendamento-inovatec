// IMPORTS
const express = require('express')
const router = express.Router()
const controller = require('../controllers/alunosController')

// ROUTES
// GET /api/alunos/:id → get one student by ID
router.get('/:id', controller.buscarAluno)

// GET /api/alunos/:id/agendamentos → get all bookings for a student
router.get('/:id/agendamentos', controller.buscarAgendamentos)

// EXPORTS
module.exports = router