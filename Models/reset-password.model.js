const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ResetPasswordSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        require: true,
    },
    token: {
        type: String,
        default: ''
    },
}, {timestamps: true})

module.exports = mongoose.model('ResetPasswords', ResetPasswordSchema);
