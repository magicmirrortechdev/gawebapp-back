const { Schema, model } = require('mongoose');

const estimateSchema = new Schema({
    clientId: {
        type: Schema.Types.ObjectId,
        ref: "Client"
    },
    projectManager: String,
    items: [{ itemName: String, description: String, quantity: Number, rate: Number, subTotal: Number }],
    subTotal: Number,
    tax: Number,
    discount: Number,
    paid: Number,
    total: Number,
    jobName: String,
    dateStart: String,
    dateEnd: String,
    comments: String,
    img: [String],
    dateCreate: String,
    status: {
        type: String,
        enum: ['Unsent', 'Sent', 'Approve', 'Decline'],
        default: 'Unsent'
    },
    type: {
        type: String,
        enum: ['Invoice', 'Job', 'Estimate'],
        default: 'Estimate'
    },
    worker: String,

    expenses: [String],
    time: [{
        userId: { type: Schema.Types.ObjectId, ref: "User" },
        time: Number
    }]

}, {
    timestamps: true,
    versionKey: false
});


module.exports = model('Estimate', estimateSchema);