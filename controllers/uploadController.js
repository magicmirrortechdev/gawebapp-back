exports.upload = (req, res) => {
    res.status(201).json({ img: req.file.url })
}