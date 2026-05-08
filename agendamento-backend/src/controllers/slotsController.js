// IMPORTS
const db = require('../db/placeholder')

// buscarSlots
// Returns all available slots, excluding ones the student already booked
function buscarSlots(req, res) {
  const alunoId = Number(req.query.alunoId)

  // Get all slots that are still available
  let slots = db.slots.filter(s => s.disponivel === true)

  // If a student ID was provided, also exclude slots they already have booked
  if (alunoId) {
    const agendamentosDoAluno = db.agendamentos.filter(
      a => a.alunoId === alunoId && a.status === 'confirmado'
    )
    const slotIdsJaAgendados = agendamentosDoAluno.map(a => a.slotId)
    slots = slots.filter(s => !slotIdsJaAgendados.includes(s.id))
  }

  res.json(slots)
}

// EXPORTS
module.exports = {
  buscarSlots
}