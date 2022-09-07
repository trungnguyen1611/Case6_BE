const Icon = require('../Models/icon.model');

module.exports = {
    add: async (req,res,next)=>{
        console.log(req.body)
        let newIcon = new Icon({
            name: req.body.name,
            url: req.body.url
        });
        await newIcon.save(function (err) {
            if (err) {
                return res.json({success: false, msg: "err"});
            }
            res.json({success: true, msg: 'Successful created new icon.'});
        });
    },
    getAll:async (req,res)=>{
        const data = await Icon.find();
        res.json({success: false, data:data})
    }
}
