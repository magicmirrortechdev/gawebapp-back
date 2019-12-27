const { Router } = require('express')
const router = Router()
const { createJob, getAllJobs } = require('../controllers/jobControllers')



router.post('/createjob', createJob);
router.get('/checkjobs', getAllJobs);


module.exports = router;