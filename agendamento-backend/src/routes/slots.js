// IMPORTS
const express = require('express')
const router = express.Router()
const controller = require('../controllers/slotsController')

// ROUTES
// GET /api/slots → get all available slots
router.get('/', controller.buscarSlots)

// EXPORTS
module.exports = router