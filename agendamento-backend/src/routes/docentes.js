const express = require('express')
const router = express.Router()
const controller = require('../controllers/docentesController')

// Perfil
router.get('/:id', controller.obterPerfil)

// Agendamentos
router.get('/:id/agendamentos', controller.listarAgendamentos)
router.post('/:id/agendamentos', controller.criarAgendamentoPontual)

// Disponibilidade recorrente
router.get('/:id/disponibilidade', controller.listarDisponibilidade)
router.post('/:id/disponibilidade', controller.cadastrarDisponibilidade)
router.delete('/:id/disponibilidade/:disponibilidadeId', controller.removerDisponibilidade)

// Exceções pontuais
router.get('/:id/excecoes', controller.listarExcecoes)
router.post('/:id/excecoes', controller.cadastrarExcecao)
router.delete('/:id/excecoes/:excecaoId', controller.removerExcecao)

module.exports = router
