const { Schema, model } = require('mongoose')

const expenseV2Schema = new Schema(
  {
    jobId: {
      type: Schema.Types.ObjectId,
      ref: 'Job',
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    date: Date,
    vendor: String,
    category: String,
    description: String,
    image: String,
    total: Number,
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

module.exports = model('Expense', expenseV2Schema)
