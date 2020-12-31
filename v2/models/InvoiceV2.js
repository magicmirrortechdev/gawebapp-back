const { Schema, model } = require('mongoose')

const invoiceV2Schema = new Schema(
  {
    jobId: {
      type: Schema.Types.ObjectId,
      ref: 'Job',
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    invoiceDate: Date,
    invoiceTotal: Number,
    invoiceDescription: String,
    isSent: Boolean,
    isPaid: Boolean,
    invoiceStatus: String,
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
        paidDate: Date,
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

module.exports = model('Invoice', invoiceV2Schema)
