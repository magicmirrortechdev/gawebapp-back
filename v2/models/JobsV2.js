const { Schema, model } = require('mongoose')

const jobV2Schema = new Schema(
  {
    dateStart: {
      type: String,
      default: 'Update this field',
    },
    dateEnd: {
      type: String,
      default: 'Update this field',
    },
    dateCreate: String,
    status: String,
    clientId: {
      type: Schema.Types.ObjectId,
      ref: 'Client',
    },
    jobName: String,
    jobAddress: String,
    items: [{ itemName: String, itemDescription: String, quantity: Number, rate: Number, subtotal: Number }],
    estimateDiscount: Number,
    estimatePaid: Number,
    estimateSubtotal: Number,
    estimateTax: Number,
    estimateTotal: Number,
    estimateName: String,
    comments: String,
    isSent: Boolean,
    isAccepted: Boolean,
    isJob: Boolean,
    workers: [
      {
        workerId: {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

module.exports = model('Job', jobV2Schema)
