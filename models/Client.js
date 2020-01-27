const { Schema, model } = require('mongoose');

const clientSchema = new Schema({
    email: String,
    name: String,
    address: String,
    contact: String,
    phone: Number,
    mobile: Number,
    website: String,
    tax: Number,
    customPayment: String,
    notes: String,
    estimatesId: [{
        type: Schema.Types.ObjectId,
        ref: "Estimate"
    }]

}, {
    timestamps: true,
    versionKey: false
});


module.exports = model('Client', clientSchema);