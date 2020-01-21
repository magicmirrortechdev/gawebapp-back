const { Schema, model } = require('mongoose');

const estimateSchema = new Schema({
    nameClient: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    projectManager: String,
    items: [String],
    jobName: String,
    dateStart: String,
    dateEnd: String,
    type: {
        type: String,
        required: true,
        enum: ['Invoice', 'Job', 'Estimate']
    },
    worker: String,
    invoice: String,
    expenses: String,
    time: [{ userId: type: Schema.Types.ObjectId, ref: "User" }]

}, {
    timestamps: true,
    versionKey: false
});


module.exports = model('Estimate', estimateSchema);