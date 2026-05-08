// IMPORTS
const db = require('../db/placeholder')

// ─────────────────────────────────────────────────────────────────────────────
// AGENDAMENTOS
// ─────────────────────────────────────────────────────────────────────────────

// buscarAgendamentos
// Returns all bookings with optional filters: aluno (name search), docente (name search),
// data (exact YYYY-MM-DD), status, and mes (YYYY-MM prefix)
function buscarAgendamentos(req, res) {
  const { aluno, docente, data, status, mes } = req.query

  let resultado = db.agendamentos

  if (aluno) {
    resultado = resultado.filter(a => {
      const alunoObj = db.alunos.find(al => al.id === a.alunoId)
      return alunoObj && alunoObj.nome.toLowerCase().includes(aluno.toLowerCase())
    })
  }

  if (docente) {
    resultado = resultado.filter(a =>
      a.docenteNome.toLowerCase().includes(docente.toLowerCase())
    )
  }

  if (data) {
    resultado = resultado.filter(a => a.data === data)
  }

  if (status) {
    resultado = resultado.filter(a => a.status === status)
  }

  if (mes) {
    resultado = resultado.filter(a => a.data.startsWith(mes))
  }

  // Enrich each booking with the student's name and telegram handle
  resultado = resultado.map(a => {
    const alunoObj = db.alunos.find(al => al.id === a.alunoId)
    return {
      ...a,
      alunoNome: alunoObj ? alunoObj.nome : 'Desconhecido',
      alunoTelegram: alunoObj ? alunoObj.telegram : ''
    }
  })

  res.json(resultado)
}

// ─────────────────────────────────────────────────────────────────────────────

// buscarEstatisticas
// Returns aggregated statistics for the dashboard.
// Optional query param: mes (YYYY-MM) to scope to a specific month.
function buscarEstatisticas(req, res) {
  const { mes } = req.query

  let agendamentos = db.agendamentos
  if (mes) agendamentos = agendamentos.filter(a => a.data.startsWith(mes))

  const total        = agendamentos.length
  const realizados   = agendamentos.filter(a => a.status === 'realizado').length
  const faltas       = agendamentos.filter(a => a.status === 'falta').length
  const cancelamentos = agendamentos.filter(a => a.status === 'cancelado').length
  const confirmados  = agendamentos.filter(a => a.status === 'confirmado').length

  // Attendance rate: realized / (total - still pending confirmed), ignoring cancelled
  const concluidos = realizados + faltas
  const taxaPresenca = concluidos > 0 ? Math.round((realizados / concluidos) * 100) : 0

  // Unique students who had at least one 'realizado' booking
  const alunosAtendidos = new Set(
    agendamentos.filter(a => a.status === 'realizado').map(a => a.alunoId)
  ).size

  // Breakdown by tipo de atendimento
  const porTipo = {}
  agendamentos.forEach(a => {
    porTipo[a.tipoAtendimento] = (porTipo[a.tipoAtendimento] || 0) + 1
  })

  // Breakdown by docente
  const porDocente = {}
  agendamentos.forEach(a => {
    porDocente[a.docenteNome] = (porDocente[a.docenteNome] || 0) + 1
  })

  // Breakdown by modalidade
  const porModalidade = {}
  agendamentos.forEach(a => {
    porModalidade[a.modalidade] = (porModalidade[a.modalidade] || 0) + 1
  })

  res.json({
    total,
    realizados,
    faltas,
    cancelamentos,
    confirmados,
    taxaPresenca,
    alunosAtendidos,
    porTipo,
    porDocente,
    porModalidade
  })
}

// ─────────────────────────────────────────────────────────────────────────────

// exportarRelatorio
// Streams a CSV file with all bookings for the given month (or all time).
// Optional query param: mes (YYYY-MM).
function exportarRelatorio(req, res) {
  const { mes } = req.query

  let agendamentos = db.agendamentos
  if (mes) agendamentos = agendamentos.filter(a => a.data.startsWith(mes))

  const header = 'ID,Data,Horario,Aluno,Telegram,Docente,Tipo,Especificacao,Modalidade,Status,Justificativa'

  const rows = agendamentos.map(a => {
    const alunoObj = db.alunos.find(al => al.id === a.alunoId)
    const alunoNome = alunoObj ? alunoObj.nome : ''
    const alunoTelegram = alunoObj ? alunoObj.telegram : ''
    // Wrap fields with commas in double quotes
    const fields = [
      a.id,
      a.data,
      a.horario,
      `"${alunoNome}"`,
      alunoTelegram,
      `"${a.docenteNome}"`,
      a.tipoAtendimento,
      `"${a.especificacao}"`,
      a.modalidade,
      a.status,
      `"${a.justificativa || ''}"`
    ]
    return fields.join(',')
  })

  const csv = [header, ...rows].join('\n')
  const filename = mes ? `relatorio-${mes}.csv` : 'relatorio-geral.csv'

  res.setHeader('Content-Type', 'text/csv; charset=utf-8')
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
  res.send('﻿' + csv) // BOM for Excel UTF-8 compatibility
}

// ─────────────────────────────────────────────────────────────────────────────
// ALUNOS
// ─────────────────────────────────────────────────────────────────────────────

// listarAlunos
// Returns all students. Optional query param: busca (name search).
function listarAlunos(req, res) {
  const { busca } = req.query
  let alunos = db.alunos
  if (busca) {
    alunos = alunos.filter(a => a.nome.toLowerCase().includes(busca.toLowerCase()))
  }
  res.json(alunos)
}

// ─────────────────────────────────────────────────────────────────────────────

// cadastrarAluno
// Creates a new student record.
// Body: { nome, email, telegram, turno }
function cadastrarAluno(req, res) {
  const { nome, email, telegram, turno } = req.body

  if (!nome || !email || !telegram || !turno) {
    return res.status(400).json({ erro: 'Campos obrigatórios: nome, email, telegram, turno.' })
  }

  const turnosValidos = ['Noturno', 'Vespertino']
  if (!turnosValidos.includes(turno)) {
    return res.status(400).json({ erro: 'Turno inválido. Use Noturno ou Vespertino.' })
  }

  const emailExistente = db.alunos.find(a => a.email === email)
  if (emailExistente) {
    return res.status(409).json({ erro: 'E-mail já cadastrado.' })
  }

  const novo = {
    id: db.alunos.length + 1,
    nome,
    email,
    telegram: telegram.startsWith('@') ? telegram : `@${telegram}`,
    turno,
    ativo: true
  }

  db.alunos.push(novo)
  res.status(201).json(novo)
}

// ─────────────────────────────────────────────────────────────────────────────

// editarAluno
// Updates a student's fields. Only provided fields are changed.
// Body: { nome?, email?, telegram?, turno? }
function editarAluno(req, res) {
  const id = Number(req.params.id)
  const aluno = db.alunos.find(a => a.id === id)

  if (!aluno) {
    return res.status(404).json({ erro: 'Aluno não encontrado.' })
  }

  const { nome, email, telegram, turno } = req.body

  if (nome)     aluno.nome = nome
  if (email)    aluno.email = email
  if (telegram) aluno.telegram = telegram.startsWith('@') ? telegram : `@${telegram}`

  if (turno) {
    const turnosValidos = ['Noturno', 'Vespertino']
    if (!turnosValidos.includes(turno)) {
      return res.status(400).json({ erro: 'Turno inválido. Use Noturno ou Vespertino.' })
    }
    aluno.turno = turno
  }

  res.json(aluno)
}

// ─────────────────────────────────────────────────────────────────────────────

// desativarAluno
// Soft-deletes a student (sets ativo = false).
function desativarAluno(req, res) {
  const id = Number(req.params.id)
  const aluno = db.alunos.find(a => a.id === id)

  if (!aluno) {
    return res.status(404).json({ erro: 'Aluno não encontrado.' })
  }

  if (!aluno.ativo) {
    return res.status(409).json({ erro: 'Aluno já está inativo.' })
  }

  aluno.ativo = false
  res.json({ mensagem: 'Aluno desativado com sucesso.', aluno })
}

// ─────────────────────────────────────────────────────────────────────────────
// DOCENTES
// ─────────────────────────────────────────────────────────────────────────────

// listarDocentes
// Returns all docentes. Optional query param: busca (name search).
function listarDocentes(req, res) {
  const { busca } = req.query
  let docentes = db.docentes
  if (busca) {
    docentes = docentes.filter(d => d.nome.toLowerCase().includes(busca.toLowerCase()))
  }
  res.json(docentes)
}

// ─────────────────────────────────────────────────────────────────────────────

// cadastrarDocente
// Creates a new docente record.
// Body: { nome, email, telegram, papel }
function cadastrarDocente(req, res) {
  const { nome, email, telegram, papel } = req.body

  if (!nome || !email || !telegram || !papel) {
    return res.status(400).json({ erro: 'Campos obrigatórios: nome, email, telegram, papel.' })
  }

  const papeisValidos = ['Mentor', 'Docente', 'Coordenador']
  if (!papeisValidos.includes(papel)) {
    return res.status(400).json({ erro: 'Papel inválido. Use Mentor, Docente ou Coordenador.' })
  }

  const emailExistente = db.docentes.find(d => d.email === email)
  if (emailExistente) {
    return res.status(409).json({ erro: 'E-mail já cadastrado.' })
  }

  const novo = {
    id: db.docentes.length + 1,
    nome,
    email,
    telegram: telegram.startsWith('@') ? telegram : `@${telegram}`,
    papel,
    ativo: true
  }

  db.docentes.push(novo)
  res.status(201).json(novo)
}

// ─────────────────────────────────────────────────────────────────────────────

// editarDocente
// Updates a docente's fields. Only provided fields are changed.
// Body: { nome?, email?, telegram?, papel? }
function editarDocente(req, res) {
  const id = Number(req.params.id)
  const docente = db.docentes.find(d => d.id === id)

  if (!docente) {
    return res.status(404).json({ erro: 'Docente não encontrado.' })
  }

  const { nome, email, telegram, papel } = req.body

  if (nome)     docente.nome = nome
  if (email)    docente.email = email
  if (telegram) docente.telegram = telegram.startsWith('@') ? telegram : `@${telegram}`

  if (papel) {
    const papeisValidos = ['Mentor', 'Docente', 'Coordenador']
    if (!papeisValidos.includes(papel)) {
      return res.status(400).json({ erro: 'Papel inválido. Use Mentor, Docente ou Coordenador.' })
    }
    docente.papel = papel
  }

  res.json(docente)
}

// ─────────────────────────────────────────────────────────────────────────────

// desativarDocente
// Soft-deletes a docente (sets ativo = false).
function desativarDocente(req, res) {
  const id = Number(req.params.id)
  const docente = db.docentes.find(d => d.id === id)

  if (!docente) {
    return res.status(404).json({ erro: 'Docente não encontrado.' })
  }

  if (!docente.ativo) {
    return res.status(409).json({ erro: 'Docente já está inativo.' })
  }

  docente.ativo = false
  res.json({ mensagem: 'Docente desativado com sucesso.', docente })
}

// ─────────────────────────────────────────────────────────────────────────────
// LISTA DE ESPERA
// ─────────────────────────────────────────────────────────────────────────────

// listarListaEspera
// Returns all active waiting list entries enriched with student data.
function listarListaEspera(req, res) {
  const entradas = db.listaEspera
    .filter(l => l.status === 'aguardando')
    .map(l => {
      const alunoObj = db.alunos.find(a => a.id === l.alunoId)
      return {
        ...l,
        alunoNome: alunoObj ? alunoObj.nome : 'Desconhecido',
        alunoTelegram: alunoObj ? alunoObj.telegram : '',
        alunoTurno: alunoObj ? alunoObj.turno : ''
      }
    })

  res.json(entradas)
}

// ─────────────────────────────────────────────────────────────────────────────

// atenderListaEspera
// Marks a waiting list entry as 'atendido' (student was pulled from the queue).
function atenderListaEspera(req, res) {
  const id = Number(req.params.id)
  const entrada = db.listaEspera.find(l => l.id === id)

  if (!entrada) {
    return res.status(404).json({ erro: 'Entrada não encontrada na lista de espera.' })
  }

  if (entrada.status === 'atendido') {
    return res.status(409).json({ erro: 'Aluno já foi removido da fila.' })
  }

  entrada.status = 'atendido'
  res.json({ mensagem: 'Aluno removido da fila com sucesso.', entrada })
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────────────────────────────
module.exports = {
  buscarAgendamentos,
  buscarEstatisticas,
  exportarRelatorio,
  listarAlunos,
  cadastrarAluno,
  editarAluno,
  desativarAluno,
  listarDocentes,
  cadastrarDocente,
  editarDocente,
  desativarDocente,
  listarListaEspera,
  atenderListaEspera
}
