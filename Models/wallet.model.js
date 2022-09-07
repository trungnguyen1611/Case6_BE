const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const WalletSchema = new Schema({
    name: {
        type: String,
        require: true,
    },
    initial:{
        type: Number,
        require: true,
    },
    icon:{
        type: Schema.Types.ObjectId,
        ref: "Icon"
    },
    currency:{
        type: Schema.Types.ObjectId,
        ref: "Currency"
    },
    user:{
        type: Schema.Types.ObjectId,
        ref:"User"
    }


},{timestamps: true})

module.exports = mongoose.model('Wallet', WalletSchema);
