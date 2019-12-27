const { Schema, model } = require('mongoose');

const clientSchema = new Schema({
    email: String,
    name: String,
    address: String,
    contact: String,
    phone: Number,
    mobile: Number,
    website: String,
    tax: String,
    customPayment: String,
    notes: String
}, {
    timestamps: true,
    versionKey: false
});


module.exports = model('Client', clientSchema);