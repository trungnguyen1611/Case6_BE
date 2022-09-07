const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const IconSchema = new Schema({
    name: {
        type: String,
        require: true,
    },
    url: {
        type: String,
        require: true,
    }
},{timestamps: true})

module.exports = mongoose.model('Icon', IconSchema);
