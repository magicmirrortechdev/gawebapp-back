const { Router } = require('express')
const router = Router()
const { createEstimate, getAllEstimates } = require('../controllers/estimateControllers')



router.post('/addestimate', createEstimate);
router.get('/checkestimates', getAllEstimates);



module.exports = router;