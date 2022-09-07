import {model, Schema} from "mongoose";

const OTPschema = new Schema({
        otp: String,
        user_id: String,
        email: String,
        time: {
            type: Date,
            default: Date.now,
            // index: {expires: 300}
        }
    },
    {timestamps: true}
)

const OTP_schema = model('OTP', OTPschema);
module.exports={OTP_schema}