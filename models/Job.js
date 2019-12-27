const { Schema, model } = require('mongoose');

const jobSchema = new Schema({
    nameClient: String,
    projectManager: String,
    jobName: String,
    dateStart: String,
    dateEnd: String,
    type: String,
    worker: String,
    invoice: String,
    expenses: String,
}, {
    timestamps: true,
    versionKey: false
});


module.exports = model('Job', jobSchema);