const { Router } = require('express')
const router = Router()
const {
  createClient,
  getAllClients,
  oneClient,
  updateClient,
  deleteClient,
} = require('../controllers/ClientControllers')

router.post('/createclient', createClient)
router.get('/checkclients', getAllClients)
router.get('/oneclient/:id', oneClient)
router.patch('/updateclient/:id', updateClient)
router.delete('/deleteclient/:id', deleteClient)

module.exports = router
