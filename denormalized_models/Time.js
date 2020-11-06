const { Schema, model } = require('mongoose')

const timeSchema = new Schema(
  {
    jobId: {
      type: Schema.Types.ObjectId,
      ref: 'Job',
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    date: String,
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

module.exports = model('Time', timeSchema)
