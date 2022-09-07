const argon2 = require("argon2");
let config = require('../config/db.config');
let jwt = require('jsonwebtoken');

let User = require("../Models/user.model");
let ResetPassword = require("../Models/reset-password.model");
const asyncWrapper = require("../Middleware/async");
const mailer = require("../utils/mailer");
const md5 = require('md5');
const {sendMail} = require('../utils/mailer')
const URL_FE = 'http://localhost:3000/'
const URL_BE = 'http://localhost:8080/'

const defaultAvatar = "https://firebasestorage.googleapis.com/v0/b/aloha-money.appspot.com/o/DefaultUser.jpg?alt=media&token=58615f07-c33a-42f7-aa11-43b9d8170593"

module.exports = {

    signup: asyncWrapper(async function (req, res) {
        const checkUser = await User.findOne({email: req.body.email})
        if (!req.body.email || !req.body.password) {
            res.status(401).json({success: false, msg: 'Please pass username and password.'});
        } else if (!req.body.confirmPassword) {
            res.status(401).json({success: false, msg: 'Please pass confirm password.'})
        } else if (req.body.password !== req.body.confirmPassword) {
            res.status(401).json({success: false, msg: 'Wrong confirm password.'})
        } else if (checkUser?.email) {
            return res.status(401).json({success: false, msg: 'Email already exists'})
        } else {
            const hashPassword = await argon2.hash(req.body.password)
            let newUser = new User({
                email: req.body.email,
                password: hashPassword,
                avatarUrl: defaultAvatar,
                isActive: false,
            });
            let OTP = Math.floor(Math.random() * 1000000)
            let htmlContent = `
            <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
            <div style="margin:50px auto;width:70%;padding:20px 0">
            <div style="border-bottom:1px solid #eee">
            <a href=${URL_FE + "login"} style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Aloha</a>
            </div>
            <p style="font-size:1.1em">Hi,</p>
            <p>Thank you for choosing Aloha. Click the following OTP to complete your Sign Up procedures.</p>
            <a href=${URL_BE + "auth/checkSignUp?email=" + req.body.email} style="background: #00466a;margin: 0 auto;text-decoration:none;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;"
            >${OTP}
            </a>
            <p style="font-size:0.9em;">Regards,<br />Aloha</p>
            <hr style="border:none;border-top:1px solid #eee" />
            <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
              <p>Aloha Inc</p>
              <p>1600 Amphitheatre Parkway</p>
              <p>California</p>
            </div>
            </div>
            </div>`
            sendMail(req.body.email, 'Sign up Aloha', htmlContent)
            await newUser.save(function (err) {
                if (err) {
                    return res.status(401).json({success: false, msg: 'Username already exists.'});
                }
                res.json({success: true, msg: 'Successful created new user.'});
            });
        }
    }),

    checkSignUp: asyncWrapper(async (req, res) => {
        await User.findOneAndUpdate({email: req.query.email}, {isActive: true})
        return res.redirect('http://localhost:3000/login')
    }),

    signin: asyncWrapper(async function (req, res) {
        let currentUser = await User.findOne({email: req.body.email})
        if (!currentUser) return res.status(400).json({success: false, message: 'Wrong email or password'})
        if (!currentUser.isActive) return res.status(401).json({
            success: false,
            message: 'Email has not been activated'
        })
        const passwordValid = await argon2.verify(currentUser.password, req.body.password);
        if (!passwordValid) return res.status(400).json({success: false, message: 'Wrong email or password'})
        let token = jwt.sign(currentUser.toJSON(), process.env.SECRET_KEY);
        const {password, ...userInfor} = currentUser._doc;
        res.json({success: true, token: 'JWT ' + token, currentUser: userInfor});
    }),

    changePassword: (async function (req, res) {
        const {oldPassword, newPassword, confirmPassword} = req.body;
        if (!oldPassword) return res
            .status(400)
            .json({success: false, message: 'enter old password'})

        try {
            const passwordValid = await argon2.verify(req.user.password, oldPassword);
            if (!passwordValid)
                return res
                    .status(400)
                    .json({success: false, message: 'wrong old password'})
            if (newPassword !== confirmPassword)
                return res
                    .status(400)
                    .json({success: false, message: 'password did not match'})
            const hashPassword = await argon2.hash(newPassword)
            await User.updateOne({_id: req.user._id}, {
                password: hashPassword
            })
            res.status(200).json({success: true, message: 'change password successful'})
        } catch (err) {
            console.log(err)
            res.status(500).json({success: false, message: err.message})
        }
    }),

    signInWithFireBase: asyncWrapper(async function (req, res, next) {
        let currentUser = await User.findOne({uid: req.body.uid})
        if (!currentUser) {
            try {
                !req.body.email && (req.body.email = '')
                let newUser = new User({...req.body});
                currentUser = await newUser.save()
            } catch (err) {
                console.log(err.message)
            }
        }
        let token = jwt.sign(JSON.stringify(req.body), process.env.SECRET_KEY);
        res.status(200).json({success: true, token: 'JWT ' + token, msg: "Login successful", currentUser});
    }),

    forgotPassword: asyncWrapper(async function (req, res, next) {
        const {email} = req.body;
        const user = await User.findOne({email: email});
        if (!user) {
            res.status(200).json({
                success: false,
                message: 'This email is not registered with us, please try again',
            });
        }
        const token = md5(user._id + user.email + new Date().getTime());
        const resetUrl = `${process.env.NODE_ENV === 'prod' ? '' : 'http://localhost:3000'}/reset-password/${token}`;
        let newResetPassword = new ResetPassword({
            userId: user._id,
            token: token,
        });
        await newResetPassword.save();

        try {
            // Lấy data truyền lên từ form phía client
            const html = `<p><b>Hello ${user.username}!</b></p> <br>
                        Your reset password link is :<a href='${resetUrl}'>click here</a> <br>
                        Please do not disclose this OTP to any"one else.`
            // Thực hiện gửi email
            await mailer.sendMail(email, 'Password Recovering', html)
            // Quá trình gửi email thành công thì gửi về thông báo success cho người dùng
            res.status(200).json({success: true, message: 'Please check your email account for further instructions.'})
        } catch (error) {
            // Nếu có lỗi thì log ra để kiểm tra và cũng gửi về client
            res.send(error)
        }

        res.status(200).json({success: true});
    }),

    resetPassword: asyncWrapper(async function (req, res, next) {
        const {token, password, confirmPassword} = req.body;
        const resetPassword = await ResetPassword.findOne({token: token}, {}, {$sort: {createdAt: -1}});
        if (!resetPassword) {
            res.status(400).json({
                success: false,
                message: 'Token is not exist!',
            });
        } else if ((new Date().getTime() - new Date(resetPassword.createdAt).getTime()) / 1000 > 120) {
            res.status(400).json({
                success: false,
                message: 'Token het han!',
            });
        } else if (password !== confirmPassword) {
            res.status(400).json({
                success: false,
                message: 'Sai mat khau!',
            });
        }
        const hashPassword = await argon2.hash(password)
        await User.updateOne({_id: resetPassword.userId}, {
            password: hashPassword
        })

        res.status(200).json({success: true});
    }),
};