const { Router } = require('express')
const router = Router()
const passport = require('../config/passport')
const {
  createClient,
  getAllClients,
  oneClient,
  updateClient,
  deleteClient,
} = require('../controllers/clientControllers')

router.post('/createclient', createClient)
router.get('/checkclients', getAllClients)
router.get('/oneclient/:id', oneClient)
router.patch('/updateclient/:id', updateClient)
router.delete('/deleteclient/:id', deleteClient)

module.exports = router
