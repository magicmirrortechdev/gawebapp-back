const { Schema, model } = require('mongoose')

const clientSchema = new Schema(
  {
    email: String,
    firstName: String,
    lastName: String,
    address: String,
    phone: Number,
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

module.exports = model('Client', clientSchema)
