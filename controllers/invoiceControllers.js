const Invoice = require('../models/Invoice')

exports.getAllInvoices = (req, res, next) => {
    Invoice.find().populate('clientId')
        .then(invoices => res.status(200).json({ invoices }))
        .catch(err => res.status(500).json({ err }))
}

exports.deleteInvoice = (req, res, next) => {
    const { id } = req.params
    console.log(id)
    Invoice.findByIdAndDelete(id)
        .then(invoice => res.status(200).json({ invoice }))
        .catch(err => res.status(500).json({ err }))
}