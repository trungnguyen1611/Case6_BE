const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CurrencySchema = new Schema({
    name: {
        type: String,
        require: true,
    },
    code: {
        type: String,
        require: true,
    },
    url: {
        type: String,
        require: true,
    }
},{timestamps: true})

module.exports = mongoose.model('Currency', CurrencySchema);
