const { Schema, model } = require('mongoose')

const timeV2Schema = new Schema(
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
    hours: Number,
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

module.exports = model('Time', timeV2Schema)
