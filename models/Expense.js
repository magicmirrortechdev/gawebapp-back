const { Schema, model } = require('mongoose');

const expenseSchema = new Schema({
    date: String,
    merchant: String,
    category: String,
    job: String,
    description: String,
    img: String,
    total: String,
}, {
    timestamps: true,
    versionKey: false
});


module.exports = model('Expense', expenseSchema);