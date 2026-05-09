const db = require('../db/placeholder')

// ─── A. Perfil e Agenda Básica ───────────────────────────────────────────────

function obterPerfil(req, res) {
  const id = Number(req.params.id)
  const docente = db.docentes.find(d => d.id === id)
  if (!docente) return res.status(404).json({ erro: 'Docente não encontrado.' })
  res.json(docente)
}

function listarAgendamentos(req, res) {
  const id = Number(req.params.id)
  const docente = db.docentes.find(d => d.id === id)
  if (!docente) return res.status(404).json({ erro: 'Docente não encontrado.' })

  // Collect slotIds that belong to this docente
  const slotIds = new Set(
    db.slots.filter(s => s.docenteId === id).map(s => s.id)
  )

  let resultado = db.agendamentos.filter(a => slotIds.has(a.slotId))

  // Optional: filter by month (query: ?mes=YYYY-MM)
  if (req.query.mes) {
    resultado = resultado.filter(a => a.data.startsWith(req.query.mes))
  }

  // Enrich each agendamento with the aluno name for display convenience
  const enriquecidos = resultado.map(a => {
    const aluno = db.alunos.find(al => al.id === a.alunoId)
    return { ...a, alunoNome: aluno ? aluno.nome : 'Desconhecido', alunoTelegram: aluno ? aluno.telegram : '' }
  })

  res.json(enriquecidos)
}

function criarAgendamentoPontual(req, res) {
  const docenteId = Number(req.params.id)
  const docente = db.docentes.find(d => d.id === docenteId)
  if (!docente) return res.status(404).json({ erro: 'Docente não encontrado.' })

  const { alunoId, data, horario, modalidade, tipoAtendimento, especificacao } = req.body

  if (!alunoId || !data || !horario || !modalidade || !tipoAtendimento || !especificacao) {
    return res.status(400).json({ erro: 'Campos obrigatórios: alunoId, data, horario, modalidade, tipoAtendimento, especificacao.' })
  }

  const aluno = db.alunos.find(al => al.id === Number(alunoId))
  if (!aluno) return res.status(404).json({ erro: 'Aluno não encontrado.' })

  const modalidadesValidas = ['Online', 'Presencial', 'Misto']
  if (!modalidadesValidas.includes(modalidade)) {
    return res.status(400).json({ erro: 'Modalidade inválida. Use: Online, Presencial ou Misto.' })
  }

  const tiposValidos = ['cronograma', 'simulado', 'vestibulares', 'outros']
  if (!tiposValidos.includes(tipoAtendimento)) {
    return res.status(400).json({ erro: 'Tipo inválido. Use: cronograma, simulado, vestibulares ou outros.' })
  }

  // Create a slot for this pontual appointment
  const novoSlot = {
    id: db.slots.length + 1,
    docenteId,
    docenteNome: docente.nome,
    data,
    horario,
    modalidade,
    disponivel: false
  }
  db.slots.push(novoSlot)

  const novoAgendamento = {
    id: db.agendamentos.length + 1,
    alunoId: Number(alunoId),
    slotId: novoSlot.id,
    docenteNome: docente.nome,
    data,
    horario,
    modalidade,
    tipoAtendimento,
    especificacao,
    status: 'confirmado',
    justificativa: ''
  }
  db.agendamentos.push(novoAgendamento)

  res.status(201).json(novoAgendamento)
}

// ─── B. Gestão de Disponibilidade Recorrente ────────────────────────────────

function listarDisponibilidade(req, res) {
  const id = Number(req.params.id)
  const docente = db.docentes.find(d => d.id === id)
  if (!docente) return res.status(404).json({ erro: 'Docente não encontrado.' })

  const resultado = db.disponibilidade.filter(d => d.docenteId === id)
  res.json(resultado)
}

function cadastrarDisponibilidade(req, res) {
  const docenteId = Number(req.params.id)
  const docente = db.docentes.find(d => d.id === docenteId)
  if (!docente) return res.status(404).json({ erro: 'Docente não encontrado.' })

  const { diaSemana, horario, modalidade } = req.body

  if (!diaSemana || !horario || !modalidade) {
    return res.status(400).json({ erro: 'Campos obrigatórios: diaSemana, horario, modalidade.' })
  }

  const dia = Number(diaSemana)
  if (!Number.isInteger(dia) || dia < 1 || dia > 5) {
    return res.status(400).json({ erro: 'diaSemana deve ser um número de 1 (Segunda) a 5 (Sexta).' })
  }

  if (!/^\d{2}:\d{2}$/.test(horario)) {
    return res.status(400).json({ erro: 'horario deve estar no formato HH:MM.' })
  }

  const modalidadesValidas = ['Online', 'Presencial', 'Misto']
  if (!modalidadesValidas.includes(modalidade)) {
    return res.status(400).json({ erro: 'Modalidade inválida. Use: Online, Presencial ou Misto.' })
  }

  const nova = {
    id: db.disponibilidade.length + 1,
    docenteId,
    diaSemana: dia,
    horario,
    modalidade
  }
  db.disponibilidade.push(nova)

  res.status(201).json(nova)
}

function removerDisponibilidade(req, res) {
  const docenteId = Number(req.params.id)
  const disponibilidadeId = Number(req.params.disponibilidadeId)

  const docente = db.docentes.find(d => d.id === docenteId)
  if (!docente) return res.status(404).json({ erro: 'Docente não encontrado.' })

  const entrada = db.disponibilidade.find(d => d.id === disponibilidadeId && d.docenteId === docenteId)
  if (!entrada) return res.status(404).json({ erro: 'Disponibilidade não encontrada.' })

  const idx = db.disponibilidade.indexOf(entrada)
  db.disponibilidade.splice(idx, 1)

  res.json({ mensagem: 'Disponibilidade removida com sucesso.' })
}

// ─── C. Gestão de Exceções (Bloqueios de Agenda) ────────────────────────────

function listarExcecoes(req, res) {
  const id = Number(req.params.id)
  const docente = db.docentes.find(d => d.id === id)
  if (!docente) return res.status(404).json({ erro: 'Docente não encontrado.' })

  const resultado = db.excecoes.filter(e => e.docenteId === id)
  res.json(resultado)
}

function cadastrarExcecao(req, res) {
  const docenteId = Number(req.params.id)
  const docente = db.docentes.find(d => d.id === docenteId)
  if (!docente) return res.status(404).json({ erro: 'Docente não encontrado.' })

  const { data, motivo } = req.body

  if (!data) {
    return res.status(400).json({ erro: 'Campo obrigatório: data (YYYY-MM-DD).' })
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) {
    return res.status(400).json({ erro: 'data deve estar no formato YYYY-MM-DD.' })
  }

  const nova = {
    id: db.excecoes.length + 1,
    docenteId,
    data,
    motivo: motivo || ''
  }
  db.excecoes.push(nova)

  res.status(201).json(nova)
}

function removerExcecao(req, res) {
  const docenteId = Number(req.params.id)
  const excecaoId = Number(req.params.excecaoId)

  const docente = db.docentes.find(d => d.id === docenteId)
  if (!docente) return res.status(404).json({ erro: 'Docente não encontrado.' })

  const entrada = db.excecoes.find(e => e.id === excecaoId && e.docenteId === docenteId)
  if (!entrada) return res.status(404).json({ erro: 'Exceção não encontrada.' })

  const idx = db.excecoes.indexOf(entrada)
  db.excecoes.splice(idx, 1)

  res.json({ mensagem: 'Exceção removida com sucesso.' })
}

module.exports = {
  obterPerfil,
  listarAgendamentos,
  criarAgendamentoPontual,
  listarDisponibilidade,
  cadastrarDisponibilidade,
  removerDisponibilidade,
  listarExcecoes,
  cadastrarExcecao,
  removerExcecao
}
