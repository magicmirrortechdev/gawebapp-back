const { Schema, model } = require('mongoose')
const PLM = require('passport-local-mongoose')

const userSchema = new Schema(
  {
    name: String,
    role: String,
    email: String,
    address: String,
    phone: Number,
    activity: String,
    type: {
      type: String,
      enum: ['1099', 'Employee'],
      default: '1099',
    },
    documents: [String],
    payRate: Number,
    effectiveRate: Number,
    //los dejo por si aún se usará la recuperación de password
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

userSchema.plugin(PLM, { usernameField: 'email' })
module.exports = model('User', userSchema)
