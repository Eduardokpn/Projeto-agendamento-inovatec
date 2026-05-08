// IMPORTS
const db = require('../db/placeholder')

// buscarListaEspera
// Returns all active waiting list entries for a specific student
function buscarListaEspera(req, res) {
  const alunoId = Number(req.query.alunoId)

  if (!alunoId) {
    return res.status(400).json({ erro: 'alunoId é obrigatório.' })
  }

  const entradas = db.listaEspera.filter(
    l => l.alunoId === alunoId && l.status === 'aguardando'
  )

  res.json(entradas)
}

// entrarListaEspera
// Adds a student to the waiting list
function entrarListaEspera(req, res) {
  const { alunoId, turnoPreferencial, diasPreferencia } = req.body

  // VALIDATION
  if (!alunoId || !turnoPreferencial) {
    return res.status(400).json({ erro: 'Campos obrigatórios: alunoId, turnoPreferencial.' })
  }

  // CHECK STUDENT EXISTS
  const aluno = db.alunos.find(a => a.id === alunoId)
  if (!aluno) {
    return res.status(404).json({ erro: 'Aluno não encontrado.' })
  }

  // CHECK IF ALREADY ON THE LIST
  const jaNaLista = db.listaEspera.find(l => l.alunoId === alunoId && l.status === 'aguardando')
  if (jaNaLista) {
    return res.status(409).json({ erro: 'Aluno já está na lista de espera.' })
  }

  // ADD TO LIST
  const nova = {
    id: db.listaEspera.length + 1,
    alunoId,
    turnoPreferencial,
    diasPreferencia: diasPreferencia || '',
    status: 'aguardando'
  }

  db.listaEspera.push(nova)
  res.status(201).json(nova)
}

// sairListaEspera
// Removes a student from the waiting list
function sairListaEspera(req, res) {
  const id = Number(req.params.id)

  // CHECK ENTRY EXISTS
  const entrada = db.listaEspera.find(l => l.id === id)
  if (!entrada) {
    return res.status(404).json({ erro: 'Entrada não encontrada na lista de espera.' })
  }

  // CHECK IF ALREADY LEFT
  if (entrada.status === 'atendido') {
    return res.status(409).json({ erro: 'Aluno já foi removido da lista de espera.' })
  }

  // REMOVE FROM LIST
  entrada.status = 'atendido'
  res.json({ mensagem: 'Removido da lista de espera com sucesso.', entrada })
}

// EXPORTS
module.exports = {
  buscarListaEspera,
  entrarListaEspera,
  sairListaEspera
}
