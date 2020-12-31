const { Schema, model } = require('mongoose')

const estimateSchema = new Schema(
  {
    clientId: {
      type: Schema.Types.ObjectId,
      ref: 'clients_',
    },
    items: [{ itemName: String, description: String, quantity: Number, rate: Number, subtotal: Number }],
    subtotal: Number,
    addressEstimate: String,
    nameEstimate: String,
    emailEstimate: String,
    tax: Number,
    discount: Number,
    paid: Number,
    total: Number,
    jobName: String,
    dateStart: {
      type: String,
      default: 'Update this field',
    },
    dateEnd: {
      type: String,
      default: 'Update this field',
    },
    comments: String,
    img: [String],
    dateCreate: String,
    isJob: {
      type: Boolean,
      default: false,
    },
    isInvoice: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['Unsent', 'Sent', 'Approve', 'Decline', 'Closed'],
      default: 'Unsent',
    },
    type: {
      type: String,
      enum: ['Invoice', 'Job', 'Estimate'],
      default: 'Estimate',
    },
    projectManager: [
      {
        projectId: {
          type: Schema.Types.ObjectId,
          ref: 'users_',
          autopopulate: true,
        },
        time: [
          {
            hours: Number,
            date: Date,
          },
        ],
      },
    ],

    workers: [
      {
        workerId: {
          type: Schema.Types.ObjectId,
          ref: 'users_',
          autopopulate: true,
        },
        time: [
          {
            hours: Number,
            date: Date,
          },
        ],
      },
    ],
    expenses: [
      {
        date: Date,
        workerId: {
          type: Schema.Types.ObjectId,
          ref: 'users_',
          autopopulate: true,
        },
        vendor: String,
        merchant: String,
        category: String,
        description: String,
        img: String,
        total: Number,
      },
    ],
    invoices: [
      {
        date: Date,
        workerId: {
          type: Schema.Types.ObjectId,
          ref: 'users_',
          autopopulate: true,
        },
        total: Number,
        payment: [
          {
            argyleChargeId: {
              type: String,
              default: '',
            },
            argyleChargeUrl: {
              type: String,
              default: '',
            },
            argyleStatus: {
              type: Boolean,
            },
            paid: Number,
            date: String,
          },
        ],
        status: {
          type: String,
          enum: ['Unsent', 'Sent', 'Unpaid', 'Paid'],
          default: 'Unpaid',
        },
        description: String,
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

estimateSchema.plugin(require('mongoose-autopopulate'))
module.exports = model('estimates_', estimateSchema)
