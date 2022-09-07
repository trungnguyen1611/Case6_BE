const mongoose = require('mongoose');
const URL = 'mongodb+srv://root:Password@nodeexpressprojects.mhhzvbj.mongodb.net/FinalProject?retryWrites=true&w=majority'

const connectDB = async () => {
    try {
        await mongoose.connect(URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
    } catch (err) {
        console.log(err);
    }
}

module.exports = connectDB;