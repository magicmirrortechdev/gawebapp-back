const { Schema, model } = require('mongoose');

const estimateSchema = new Schema({
    clientId: {
        type: Schema.Types.ObjectId,
        ref: "Client"
    },
    items: [{ itemName: String, description: String, quantity: Number, rate: Number, subtotal: Number }],
    subtotal: Number,
    tax: Number,
    discount: Number,
    paid: Number,
    total: Number,
    jobName: String,
    dateStart: {
        type: String,
        default: 'Update this field'
    },
    dateEnd: {
        type: String,
        default: 'Update this field'
    },
    comments: String,
    img: [String],
    dateCreate: String,
    isJob: {
        type: Boolean,
        default: false
    },
    isInvoice: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['Unsent', 'Sent', 'Approve', 'Decline', 'Unpaid', 'Paid'],
        default: 'Unsent'
    },
    type: {
        type: String,
        enum: ['Invoice', 'Job', 'Estimate'],
        default: 'Estimate'
    },
    projectManager: [{
        projectId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            autopopulate: true
        },
        time: [Number]
    }],

    workers: [{
        workerId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            autopopulate: true
        },
        time: [Number]
    }],
    expenses: [{
        date: String,
        workerId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            autopopulate: true
        },
        vendor: String,
        merchant: String,
        category: String,
        description: String,
        img: String,
        total: Number,
    }],
    invoices: [{
        date: String,
        workerId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            autopopulate: true
        },
        total: Number,
        paid: [Number],
        status: {
            type: String,
            enum: ['Unsent', 'Sent', 'Unpaid', 'Paid'],
            default: 'Unpaid'
        },
        description: String
    }],


}, {
    timestamps: true,
    versionKey: false
});

estimateSchema.plugin(require('mongoose-autopopulate'))
module.exports = model('Estimate', estimateSchema);