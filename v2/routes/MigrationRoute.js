const { Router } = require('express')
const router = Router()
const { migration } = require('../controllers/MigrationControllers')

router.get('/', migration)

module.exports = router
