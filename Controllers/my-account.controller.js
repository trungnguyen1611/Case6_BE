let User = require("../Models/user.model");
const asyncWrapper = require("../Middleware/async");

module.exports = {

    getCurrentUserInfo: asyncWrapper(async (req, res, next) => {
        let getCurrentUserInfo = await User.findOne({_id: req.body.userId})
        console.log(getCurrentUserInfo);
        res.status(200).json(getCurrentUserInfo);
    }),

    updateProfile: asyncWrapper((req, res, next) => {
        User.findByIdAndUpdate(req.body.userId, {...req.body},{ new: true },
            (err, user) => {
                if (err){console.log(err)} else {
                    res.status(200).json(user);
                }
            })
    })


}