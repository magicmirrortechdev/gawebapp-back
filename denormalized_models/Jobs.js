const { Schema, model } = require('mongoose')

const jobSchema = new Schema(
  {
    dateCreate: String,
    clientId: {
      type: Schema.Types.ObjectId,
      ref: 'Client',
    },
    jobName: String,
    jobAddress: String,
    items: [{ itemName: String, itemDescription: String, quantity: Number, rate: Number, subtotal: Number }],
    estimateSubtotal: Number,
    estimateTax: Number,
    estimateTotal: Number,
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

module.exports = model('Job', jobSchema)
