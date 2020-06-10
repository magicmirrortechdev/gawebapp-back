const { Schema, model } = require('mongoose');
const PLM = require('passport-local-mongoose');

const userSchema = new Schema({
    email: String,
    name: String,
    address: String,
    contact: String,
    phone: Number,
    mobile: Number,
    activity: String,
    type: String,
    img: [String],
    payment: Number,
    effective: Number,
    role: {
        type: String,
        enum: ['WORKER', 'ADMIN', 'PROJECT MANAGER'],
        default: 'WORKER'
    },
    works: [{
        workId: {
            type: Schema.Types.ObjectId,
            ref: "Estimate"
        },
        time: [{
            hours: Number,
            date: Date
        }]
    }],
    expenses: [{
        jobName: String,
        date: Date,
        vendor: String,
        category: String,
        description: String,
        img: String,
        total: Number,
        estimateId: String
    }],
    resetPasswordToken: String,
    resetPasswordExpires: Date,

}, {
    timestamps: true,
    versionKey: false
});

userSchema.plugin(PLM, { usernameField: 'email' });
module.exports = model('User', userSchema);