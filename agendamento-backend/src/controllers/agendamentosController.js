// IMPORTS
const db = require('../db/placeholder')

// criarAgendamento
// Creates a new booking for a student
function criarAgendamento(req, res) {
  const { alunoId, slotId, tipoAtendimento, especificacao } = req.body

  if (!alunoId || !slotId || !tipoAtendimento) {
    return res.status(400).json({ erro: 'Campos obrigatórios: alunoId, slotId, tipoAtendimento.' })
  }

  const tiposValidos = ['cronograma', 'simulado', 'vestibulares', 'outros']
  if (!tiposValidos.includes(tipoAtendimento)) {
    return res.status(400).json({ erro: 'Tipo de atendimento inválido.' })
  }

  const aluno = db.alunos.find(a => a.id === alunoId)
  if (!aluno) {
    return res.status(404).json({ erro: 'Aluno não encontrado.' })
  }

  const slot = db.slots.find(s => s.id === slotId)
  if (!slot) {
    return res.status(404).json({ erro: 'Slot não encontrado.' })
  }
  if (!slot.disponivel) {
    return res.status(409).json({ erro: 'Este slot já está ocupado.' })
  }

  const novo = {
    id: db.agendamentos.length + 1,
    alunoId,
    slotId,
    docenteNome: slot.docenteNome,
    data: slot.data,
    horario: slot.horario,
    modalidade: slot.modalidade,
    tipoAtendimento,
    especificacao: especificacao || '',
    status: 'confirmado'
  }

  slot.disponivel = false
  db.agendamentos.push(novo)
  res.status(201).json(novo)
}

// cancelarAgendamento
// Cancels an existing booking and frees the slot
function cancelarAgendamento(req, res) {
  const id = Number(req.params.id)

  const agendamento = db.agendamentos.find(a => a.id === id)
  if (!agendamento) {
    return res.status(404).json({ erro: 'Agendamento não encontrado.' })
  }

  if (agendamento.status === 'cancelado') {
    return res.status(409).json({ erro: 'Agendamento já cancelado.' })
  }

  agendamento.status = 'cancelado'

  const slot = db.slots.find(s => s.id === agendamento.slotId)
  if (slot) slot.disponivel = true

  res.json({ mensagem: 'Agendamento cancelado com sucesso.', agendamento })
}

// marcarFalta
// Marks a booking as 'falta' and optionally records a justification.
// Body: { justificativa? }
function marcarFalta(req, res) {
  const id = Number(req.params.id)
  const { justificativa } = req.body

  const agendamento = db.agendamentos.find(a => a.id === id)
  if (!agendamento) {
    return res.status(404).json({ erro: 'Agendamento não encontrado.' })
  }

  if (agendamento.status === 'falta') {
    return res.status(409).json({ erro: 'Falta já registrada.' })
  }

  if (agendamento.status === 'cancelado') {
    return res.status(409).json({ erro: 'Não é possível registrar falta em agendamento cancelado.' })
  }

  agendamento.status = 'falta'
  agendamento.justificativa = justificativa || ''

  // Free the slot so it can be reused
  const slot = db.slots.find(s => s.id === agendamento.slotId)
  if (slot) slot.disponivel = true

  res.json({ mensagem: 'Falta registrada com sucesso.', agendamento })
}

// marcarRealizado
// Marks a booking as 'realizado' (session was completed).
function marcarRealizado(req, res) {
  const id = Number(req.params.id)

  const agendamento = db.agendamentos.find(a => a.id === id)
  if (!agendamento) {
    return res.status(404).json({ erro: 'Agendamento não encontrado.' })
  }

  if (agendamento.status === 'realizado') {
    return res.status(409).json({ erro: 'Agendamento já marcado como realizado.' })
  }

  if (agendamento.status === 'cancelado') {
    return res.status(409).json({ erro: 'Não é possível marcar como realizado um agendamento cancelado.' })
  }

  agendamento.status = 'realizado'
  res.json({ mensagem: 'Agendamento marcado como realizado.', agendamento })
}

// EXPORTS
module.exports = {
  criarAgendamento,
  cancelarAgendamento,
  marcarFalta,
  marcarRealizado
}