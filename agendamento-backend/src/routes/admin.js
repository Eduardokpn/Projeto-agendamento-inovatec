// IMPORTS
const express = require('express')
const router = express.Router()
const controller = require('../controllers/adminController')

// ROUTES

// ─── AGENDAMENTOS ────────────────────────────────────────────────────────────

// GET /api/admin/agendamentos → list all bookings with optional filters
// Query params: aluno, docente, data, status, mes
router.get('/agendamentos', controller.buscarAgendamentos)

// GET /api/admin/estatisticas → aggregated stats for the dashboard
// Query params: mes (YYYY-MM)
router.get('/estatisticas', controller.buscarEstatisticas)

// GET /api/admin/relatorio → download CSV report
// Query params: mes (YYYY-MM)
router.get('/relatorio', controller.exportarRelatorio)

// ─── ALUNOS ──────────────────────────────────────────────────────────────────

// GET /api/admin/alunos → list all students
// Query params: busca (name search)
router.get('/alunos', controller.listarAlunos)

// POST /api/admin/alunos → create a new student
// Body: { nome, email, telegram, turno }
router.post('/alunos', controller.cadastrarAluno)

// PATCH /api/admin/alunos/:id → update a student's data
// Body: { nome?, email?, telegram?, turno? }
router.patch('/alunos/:id', controller.editarAluno)

// DELETE /api/admin/alunos/:id → deactivate a student (soft delete)
router.delete('/alunos/:id', controller.desativarAluno)

// ─── DOCENTES ────────────────────────────────────────────────────────────────

// GET /api/admin/docentes → list all docentes
// Query params: busca (name search)
router.get('/docentes', controller.listarDocentes)

// POST /api/admin/docentes → create a new docente
// Body: { nome, email, telegram, papel }
router.post('/docentes', controller.cadastrarDocente)

// PATCH /api/admin/docentes/:id → update a docente's data
// Body: { nome?, email?, telegram?, papel? }
router.patch('/docentes/:id', controller.editarDocente)

// DELETE /api/admin/docentes/:id → deactivate a docente (soft delete)
router.delete('/docentes/:id', controller.desativarDocente)

// ─── LISTA DE ESPERA ─────────────────────────────────────────────────────────

// GET /api/admin/lista-espera → list all active waiting list entries
router.get('/lista-espera', controller.listarListaEspera)

// PATCH /api/admin/lista-espera/:id/atender → pull student from the queue
router.patch('/lista-espera/:id/atender', controller.atenderListaEspera)

// EXPORTS
module.exports = router
