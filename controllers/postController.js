const Post = require('../models/Expense')

exports.newPost = async(req, res) => {
    const { date, merchant, category, job, description, img, total } = req.body
    await Post.create({ date, merchant, category, job, description, img, total })
    res.status(201).json({ message: 'Created' })
}