const { Router } = require('express')
const router = Router()
const passport = require('../config/passport')
const { createClient, getAllClients } = require('../controllers/clientControllers')



router.post('/createclient', createClient);
router.get('/checkclients', getAllClients);


module.exports = router;