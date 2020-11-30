const { Router } = require('express')
const router = Router()
const { getAllTimes, createTime, updateTime, deleteTime, getOneTime } = require('../controllers/TimeControllers')

router.get('/gettimes/', getAllTimes)
router.get('/gettimes/:id', getOneTime)
router.patch('/addtime/:id/:workerId', createTime)
router.patch('/updatetime/:estimateId/:workerId/:timeId', updateTime)
router.patch('/deletetime/:estimateId/:workerId/:timeId', deleteTime)

module.exports = router
