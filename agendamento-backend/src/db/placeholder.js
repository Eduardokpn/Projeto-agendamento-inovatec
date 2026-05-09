// TABLE: docentes
// Represents the teachers and mentors registered in the system.
// id      → unique identifier for the docente
// nome    → full name, displayed on screen
// email   → used for login and contact
// telegram → docente's Telegram handle for notifications
// papel   → role in the system: 'Mentor', 'Docente' or 'Coordenador'
// ativo   → if false, account is deactivated (never deleted)
const docentes = [
  {
    id: 1,
    nome: 'Prof. Rafael',
    email: 'rafael@email.com',
    telegram: '@prof.rafael',
    papel: 'Mentor',
    ativo: true
  },
  {
    id: 2,
    nome: 'Prof. Heloísa',
    email: 'heloisa@email.com',
    telegram: '@prof.heloisa',
    papel: 'Docente',
    ativo: true
  },
  {
    id: 3,
    nome: 'Letícia',
    email: 'leticia@email.com',
    telegram: '@leticia',
    papel: 'Docente',
    ativo: true
  },
  {
    id: 4,
    nome: 'Larissa',
    email: 'larissa@email.com',
    telegram: '@larissa',
    papel: 'Mentor',
    ativo: true
  }
]

// TABLE: alunos
// Represents the students registered in the system.
// id          → unique identifier for the student
// nome        → full name, displayed on screen
// email       → used for login and contact
// telegram    → student's Telegram handle for notifications
// turno       → student's shift, either 'Noturno' or 'Vespertino'
// ativo       → if false, account is deactivated (never deleted)
const alunos = [
  {
    id: 1,
    nome: 'João Silva',
    email: 'joao@email.com',
    telegram: '@joaosilva',
    turno: 'Noturno',
    ativo: true
  },
  {
    id: 2,
    nome: 'Maria Souza',
    email: 'maria@email.com',
    telegram: '@mariasouza',
    turno: 'Vespertino',
    ativo: true
  },
  {
    id: 3,
    nome: 'Carlos Lima',
    email: 'carlos@email.com',
    telegram: '@carloslima',
    turno: 'Noturno',
    ativo: true
  }
]

// TABLE: slots
// Represents the available time slots opened by docentes.
// id          → unique identifier for the slot
// docenteId   → references which docente owns this slot
// docenteNome → docente's name, ready to display without extra lookup
// data        → date of the slot in YYYY-MM-DD format
// horario     → time of the slot in HH:MM format
// modalidade  → format of the meeting: 'Online', 'Presencial' or 'Misto'
// disponivel  → if false, slot is already taken and cannot be booked
const slots = [
  {
    id: 1,
    docenteId: 1,
    docenteNome: 'Prof. Rafael',
    data: '2025-06-02',
    horario: '09:00',
    modalidade: 'Online',
    disponivel: false
  },
  {
    id: 2,
    docenteId: 1,
    docenteNome: 'Prof. Rafael',
    data: '2025-06-02',
    horario: '09:30',
    modalidade: 'Presencial',
    disponivel: true
  },
  {
    id: 3,
    docenteId: 2,
    docenteNome: 'Prof. Heloísa',
    data: '2025-06-03',
    horario: '14:00',
    modalidade: 'Online',
    disponivel: false
  },
  {
    id: 4,
    docenteId: 2,
    docenteNome: 'Prof. Heloísa',
    data: '2025-06-03',
    horario: '14:30',
    modalidade: 'Misto',
    disponivel: false
  }
]

// TABLE: agendamentos
// Represents confirmed bookings made by students.
// id              → unique identifier for the booking
// alunoId         → references which student made the booking
// slotId          → references which slot was booked
// docenteNome     → docente's name, ready to display without extra lookup
// data            → date of the meeting in YYYY-MM-DD format
// horario         → time of the meeting in HH:MM format
// modalidade      → format of the meeting: 'Online', 'Presencial' or 'Misto'
// tipoAtendimento → type of session: 'cronograma', 'simulado', 'vestibulares' or 'outros'
// especificacao   → detail that accompanies the type (e.g. which exam, which shift)
// status          → current state: 'confirmado', 'cancelado', 'falta' or 'realizado'
// justificativa   → optional absence justification, filled when status is 'falta'
const agendamentos = [
  {
    id: 1,
    alunoId: 1,
    slotId: 1,
    docenteNome: 'Prof. Rafael',
    data: '2025-06-02',
    horario: '09:00',
    modalidade: 'Online',
    tipoAtendimento: 'cronograma',
    especificacao: 'Noturno',
    status: 'confirmado',
    justificativa: ''
  },
  {
    id: 2,
    alunoId: 2,
    slotId: 3,
    docenteNome: 'Prof. Heloísa',
    data: '2025-06-03',
    horario: '14:00',
    modalidade: 'Online',
    tipoAtendimento: 'simulado',
    especificacao: 'FUVEST 2025',
    status: 'realizado',
    justificativa: ''
  },
  {
    id: 3,
    alunoId: 3,
    slotId: 4,
    docenteNome: 'Prof. Heloísa',
    data: '2025-06-03',
    horario: '14:30',
    modalidade: 'Misto',
    tipoAtendimento: 'vestibulares',
    especificacao: 'UNICAMP',
    status: 'falta',
    justificativa: 'Aluno não compareceu sem aviso.'
  }
]

// TABLE: listaEspera
// Represents students waiting for an available slot.
// id                → unique identifier for the waiting list entry
// alunoId           → references which student is waiting
// turnoPreferencial → preferred shift: 'Noturno' or 'Vespertino'
// diasPreferencia   → free text describing preferred days and times
// status            → current state: 'aguardando' or 'atendido'
const listaEspera = [
  {
    id: 1,
    alunoId: 3,
    turnoPreferencial: 'Noturno',
    diasPreferencia: 'Segunda ou Quarta',
    status: 'aguardando'
  }
]

// TABLE: disponibilidade
// Represents a docente's recurring weekly availability.
// id         → unique identifier
// docenteId  → references the docente
// diaSemana  → day of week: 1=Segunda, 2=Terça, 3=Quarta, 4=Quinta, 5=Sexta
// horario    → start time in HH:MM format (slots are always 30 min)
// modalidade → format: 'Online', 'Presencial' or 'Misto'
const disponibilidade = [
  { id: 1, docenteId: 1, diaSemana: 2, horario: '09:00', modalidade: 'Online' },
  { id: 2, docenteId: 1, diaSemana: 4, horario: '14:00', modalidade: 'Misto' },
  { id: 3, docenteId: 1, diaSemana: 5, horario: '12:30', modalidade: 'Online' }
]

// TABLE: excecoes
// Represents specific dates where a docente is NOT available (overrides disponibilidade).
// id        → unique identifier
// docenteId → references the docente
// data      → blocked date in YYYY-MM-DD format
// motivo    → optional reason for absence
const excecoes = [
  { id: 1, docenteId: 1, data: '2026-05-12', motivo: 'Feriado' }
]

// EXPORTS
// Makes all tables available to other files in the project.
// Any file that needs data does: const db = require('./placeholder')
// and can then access db.alunos, db.slots, db.docentes, etc.
module.exports = {
  docentes,
  alunos,
  slots,
  agendamentos,
  listaEspera,
  disponibilidade,
  excecoes
}