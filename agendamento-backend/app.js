// IMPORTS
// Bringing in the tools needed to run the server
const express = require('express')
const cors = require('cors')

// APP SETUP
// Creates the Express application and defines the port
const app = express()
const PORT = 3000

// MIDDLEWARE
// Rules that apply to every single request the server receives
app.use(cors())
app.use(express.json())

// ROUTES
// Tells the server which file handles which URLs

//Routes Alunos
const alunosRouter = require('./src/routes/alunos')
app.use('/api/alunos', alunosRouter)

//Routes Slots
const slotsRouter = require('./src/routes/slots')
app.use('/api/slots', slotsRouter)

//Routes Agendamentos
const agendamentosRouter = require('./src/routes/agendamentos')
app.use('/api/agendamentos', agendamentosRouter)

//Routes Lista de Espera
const listaEsperaRouter = require('./src/routes/listaEspera')
app.use('/api/lista-espera', listaEsperaRouter)

//Routes Admin
const adminRouter = require('./src/routes/admin')
app.use('/api/admin', adminRouter)

//Routes Docentes
const docentesRouter = require('./src/routes/docentes')
app.use('/api/docentes', docentesRouter)

// HEALTH CHECK
// A simple test route to confirm the server is running
app.get('/', (req, res) => {
  res.json({ message: 'API do Agendamento rodando!' })
})

// SERVER START
// Tells the server to start listening for requests on PORT 3000
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`)
})