const Invoice = require('../denormalized_models/Invoice')

exports.createInvoice = (req, res, next) => {
  Invoice.create({ ...req.body })
    .then(invoice => res.status(200).json({ invoice }))
    .catch(err => res.status(500).json({ err }))
}

exports.getAllInvoices = (req, res, next) => {
  Invoice.find()
    .lean()
    .populate('jobId')
    .populate('userId')
    .then(invoices => res.status(200).json({ invoices }))
    .catch(err => res.status(500).json({ err }))
}

exports.getOneInvoice = (req, res, next) => {
  const { id } = req.params
  Invoice.findById(id)
    .populate('jobId')
    .populate('userId')
    .then(invoice => res.status(200).json({ invoice }))
    .catch(err => res.status(500).json({ err }))
}

exports.getSentInvoices = (req, res, next) => {
  Invoice.find({ isSent: true })
    .lean()
    .populate('jobId')
    .populate('userId')
    .then(invoices => res.status(200).json({ invoices }))
    .catch(err => res.status(500).json({ err }))
}
exports.getPaidInvoices = (req, res, next) => {
  Invoice.find({ isPaid: true })
    .lean()
    .populate('jobId')
    .populate('userId')
    .then(invoices => res.status(200).json({ invoices }))
    .catch(err => res.status(500).json({ err }))
}

exports.updateInvoice = async (req, res, next) => {
  const { id } = req.params
  Invoice.findByIdAndUpdate(id, { ...req.body }, { new: true })
    .then(invoice => res.status(200).json({ invoice }))
    .catch(err => res.status(500).json({ err }))
}

exports.deleteInvoice = (req, res, next) => {
  const { id } = req.params
  Invoice.findByIdAndDelete(id)
    .then(invoice => res.status(200).json({ invoice }))
    .catch(err => res.status(500).json({ err }))
}
