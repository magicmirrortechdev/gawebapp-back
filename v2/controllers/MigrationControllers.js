const ClientV2 = require('../models/ClientV2')
const Client = require('../../models/Client')
const UserV2 = require('../models/UserV2')
const User = require('../../models/User')

const InvoiceV2 = require('../models/InvoiceV2')
const ExpenseV2 = require('../models/ExpenseV2')
const TimeV2 = require('../models/TimeV2')
const JobV2 = require('../models/JobsV2')
const Estimate = require('../../models/Estimate')

exports.migration = async (req, res, next) => {
  await ClientV2.deleteMany({})
  await UserV2.deleteMany({})
  await InvoiceV2.deleteMany({})
  await ExpenseV2.deleteMany({})
  await TimeV2.deleteMany({})
  await JobV2.deleteMany({})

  const clients = await Client.find().lean()
  for (const client of clients) {
    let name = client.name.split(' ')
    const data = {
      email: client.email,
      firstName: name[0],
      lastName: client.name.replace(name[0], ''),
      address: client.address,
      phone: client.phone,
    }
    await ClientV2.create(data)
  }

  const users = await User.find()
  for (const user of users) {
    const data = {
      name: user.name,
      role: user.role,
      email: user.email,
      address: user.address,
      phone: user.phone,
      mobile: user.mobile,
      activity: user.activity,
      type: user.type,
      payRate: user.payment,
      effectiveRate: user.effective,
      resetPasswordToken: user.resetPasswordToken,
      resetPasswordExpires: user.resetPasswordExpires,
      level: user.level,
      contactName: user.contact,
    }
    await UserV2.register(data, 'GreenAcorn2020')
  }

  const estimates = await Estimate.find()
    .populate('clientId')
    .populate('expenses')
    .populate('invoices')
    .populate({ path: 'workerId' })
    .populate({ path: 'workers.workerId' })
    .populate({ path: 'expenses.workerId' })
  for (const estimate of estimates) {
    const client = await Client.findById(estimate.clientId._id)
    const clientV2 = await ClientV2.findOne({ email: client.email })

    let workers = []
    for (const worker of estimate.workers) {
      if (worker.workerId) {
        const user = await UserV2.findOne({ email: worker.workerId.email })
        workers.push({ workerId: user })
      }
    }
    for (const project of estimate.projectManager) {
      if (project.projectId) {
        const user = await UserV2.findOne({ email: project.projectId.email })
        workers.push({ workerId: user })
      }
    }

    const job = {
      dateStart: estimate.dateStart,
      dateEnd: estimate.dateEnd,
      clientId: clientV2,
      jobName: estimate.jobName,
      jobAddress: estimate.addressEstimate,
      items: estimate.items,
      estimatePaid: estimate.paid,
      estimateDiscount: estimate.discount,
      estimateSubtotal: estimate.subtotal,
      estimateTax: estimate.tax,
      estimateTotal: estimate.total,
      estimateName: estimate.nameEstimate,
      isSent: estimate.status === 'Sent' ? true : false,
      isAccepted: estimate.status === 'Approve' ? true : false,
      isJob: estimate.isJob,
      workers: workers,
      status: estimate.status,
      dateCreate: estimate.dateCreate,
      createdAt: estimate.createdAt,
      updatedAt: estimate.updatedAt,
    }
    await JobV2.create(job)

    for (const expense of estimate.expenses) {
      if (expense.workerId) {
        const job = await JobV2.findOne({ jobName: estimate.jobName })
        const userV2 = await UserV2.findOne({ email: expense.workerId.email })
        const expenseData = {
          jobId: job._id,
          userId: userV2._id,
          date: expense.date,
          vendor: expense.vendor,
          category: expense.category,
          description: expense.description,
          image: expense.img,
          total: expense.total,
        }
        await ExpenseV2.create(expenseData)
      }
    }

    for (const invoice of estimate.invoices) {
      const job = await JobV2.findOne({ jobName: estimate.jobName })
      let user = null
      if (invoice.workerId) {
        user = await UserV2.findOne({ email: invoice.workerId.email })
      }

      let payments = []
      for (const payment of invoice.payment) {
        payments.push({
          paidAmount: payment.paid,
          paidDate: payment.date,
        })
      }

      const invoiceData = {
        jobId: job._id,
        userId: user != null ? user._id : null,
        invoiceDate: invoice.date,
        invoiceTotal: invoice.total,
        invoiceDescription: invoice.description,
        invoiceStatus: invoice.status,
        isSent: invoice.status === 'Sent' ? true : false,
        isPaid: invoice.status === 'Paid' ? true : false,
        payments: payments,
      }
      await InvoiceV2.create(invoiceData)
    }

    for (const worker of estimate.workers) {
      if (worker.workerId && worker.time) {
        const job = await JobV2.findOne({ jobName: estimate.jobName })
        const user = await UserV2.findOne({ email: worker.workerId.email })
        for (const time of worker.time) {
          const timeData = {
            jobId: job._id,
            userId: user._id,
            date: time.date,
            hours: time.hours,
          }
          await TimeV2.create(timeData)
        }
      }
    }
  }
  res.status(201).json({ ok: 1 })
}
