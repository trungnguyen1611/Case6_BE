const Currency = require('../Models/currency.model');

module.exports = {
    getAll:async (req,res)=>{
        const data = await Currency.find();
        res.json({success: false, data:data})
    }
}
