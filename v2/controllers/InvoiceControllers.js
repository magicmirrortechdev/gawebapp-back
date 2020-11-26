const Invoice = require('../models/InvoiceV2')

exports.createInvoice = async (req, res, next) => {
  const { id } = req.params
  const { date, description, total } = req.body
  var fecha = new Date()
  var mes = fecha.getMonth() + 1
  var dia = fecha.getDate()
  var ano = fecha.getFullYear()
  if (dia < 10) dia = '0' + dia //agrega cero si es menor de 10
  if (mes < 10) mes = '0' + mes //agrega cero si es menor de 10

  Invoice.findByIdAndUpdate(
    id,
    {
      isJob: true,
      status: 'Approve',
      dateStart: `${ano}-${mes}-${dia}`,
      $push: { invoices: { date, total, description } },
    },
    { new: true }
  )
    .populate('clientId')
    .populate({ path: 'workerId' })
    .then(estimate => res.status(200).json({ estimate }))
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

exports.sendInvoice2 = (req, res, next) => {
  const { name, date, total, description, tags, urlPay, invoiceId, jobId } = req.body
  const query = { _id: invoiceId }

  sendInvoice(name, date, total, description, tags, urlPay, jobId)
    .then(info => {
      Invoice.findOneAndUpdate(query, { status: 'Sent' }, { new: true })
        .then(estimate => {
          res.send('Email sent')
        })
        .catch(err => {
          res.send(err)
        })
    })
    .catch(err => {
      console.log(err)
      res.send(err)
    })
}

exports.acceptPayment = (req, res, next) => {
  const { id, invoiceId } = req.params
  const { paid, date } = req.body
  const query = {
    _id: invoiceId,
  }
  Invoice.findOneAndUpdate(query, { query, $push: { '$.payment': { paid, date } } }, { new: true })
    .populate('clientId')
    .populate({ path: 'workerId' })
    .then(estimate => {
      res.status(200).json({ estimate })
    })
    .catch(err => res.status(500).json({ err }))
}