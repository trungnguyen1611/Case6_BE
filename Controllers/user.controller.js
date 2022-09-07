let User = require("../Models/user.model");

module.exports = {
    deleteAccount: async (req, res) => {
        let message = ''
        try {
            const userId = req.body.userId
            const data = await User.findOneAndUpdate({_id: userId}, {$set: {isActive: false}}, {new: true});
            if (!data.isActive) {
                message = "Successful delete account"
            }
            res.json({success: true, data, msg: message})
        } catch (err) {
            message = "failed to delete account"
            res.json({success: false, msg: message});
        }
    },
}