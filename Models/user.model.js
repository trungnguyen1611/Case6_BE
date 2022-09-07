const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');


const UserSchema = new Schema({
    email: {
        type: String,
    },
    username: {
        type: String,
        default: ''
    },
    password: {
        type: String,
    },
    avatarUrl: {
        type: String
    },
    uid: {
        type:String,
        optional: true,
    },
    phone:{
        type: String,
        optional: true,
    },
    company:{
        type: String,
        optional: true,
    },
    birthday:{
        type: String,
        optional: true,
    },
    wallet:{
        type: Schema.Types.Array,
        ref: 'Wallet'
    },
    isActive:{
        type: Boolean,
        default: true
    }
},{timestamps: true})

module.exports = mongoose.model('User', UserSchema);
