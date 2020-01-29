const Invoice = require('../models/Invoice')

exports.getAllInvoices = (req, res, next) => {
    Invoice.find().populate('clientId')
        .then(invoices => res.status(200).json({ invoices }))
        .catch(err => res.status(500).json({ err }))
}