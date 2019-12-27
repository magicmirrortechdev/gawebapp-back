const { Router } = require('express')
const router = Router()
const { newPost } = require('../controllers/postController')

router.post('/addexpense', newPost)

module.exports = router