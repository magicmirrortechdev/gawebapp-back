const { Router } = require('express')
const router = Router()
const { getAllTimes, createTime, updateTime, deleteTime, getOneTime } = require('../controllers/TimeControllers')

router.get('/gettimes/:id', getAllTimes)
router.patch('/addtime/', createTime)
router.patch('/updatetime/:timeId', updateTime)
router.patch('/deletetime/:timeId', deleteTime)

module.exports = router
