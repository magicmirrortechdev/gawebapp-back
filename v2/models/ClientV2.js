const { Schema, model } = require('mongoose')

const clientV2Schema = new Schema(
  {
    email: String,
    firstName: String,
    lastName: String,
    address: String,
    phone: Number,
    contact: String,
    customPayment: String,
    mobile: String,
    notes: String,
    tax: Number,
    website: String,
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

module.exports = model('Client', clientV2Schema)
