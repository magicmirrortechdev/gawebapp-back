const { Router } = require('express')
const router = Router()
const { createJob } = require('../controllers/jobControllers')



router.post('/createjob', createJob);


module.exports = router;