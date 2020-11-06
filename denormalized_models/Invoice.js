const { Schema, model } = require('mongoose')

const invoiceSchema = new Schema(
  {
    jobId: {
      type: Schema.Types.ObjectId,
      ref: 'Job',
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    invoiceDate: String,
    invoiceTotal: Number,
    invoiceDescription: String,
    isSent: Boolean,
    isPaid: Boolean,
    payments: [
      {
        argyleChargeId: {
          type: String,
          default: '',
        },
        argyleChargeUrl: {
          type: String,
          default: '',
        },
        paidAmount: Number,
        paidDate: String,
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

module.exports = model('Invoice', invoiceSchema)
