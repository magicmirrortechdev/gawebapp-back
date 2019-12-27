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
    documents: [String],
    payment: Number,
    effective: Number,
    role: {
        type: String,
        enum: ['WORKER', 'ADMIN'],
        default: 'WORKER'
    },
    works: [{
        type: Schema.Types.ObjectId,
        ref: "Job"
    }],

}, {
    timestamps: true,
    versionKey: false
});

userSchema.plugin(PLM, { usernameField: 'email' });

module.exports = model('User', userSchema);