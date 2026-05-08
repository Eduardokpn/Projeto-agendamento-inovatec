// IMPORTS
const db = require('../db/placeholder')

// buscarAluno
// Finds and returns a single student by their ID
function buscarAluno(req, res) {
  const id = Number(req.params.id)
  const aluno = db.alunos.find(a => a.id === id)

  if (!aluno) {
    return res.status(404).json({ erro: 'Aluno não encontrado.' })
  }

  res.json(aluno)
}

// buscarAgendamentos
// Returns all bookings for a specific student
function buscarAgendamentos(req, res) {
  const id = Number(req.params.id)
  const aluno = db.alunos.find(a => a.id === id)

  if (!aluno) {
    return res.status(404).json({ erro: 'Aluno não encontrado.' })
  }

  const agendamentos = db.agendamentos.filter(a => a.alunoId === id)
  res.json(agendamentos)
}

// EXPORTS
module.exports = {
  buscarAluno,
  buscarAgendamentos
}