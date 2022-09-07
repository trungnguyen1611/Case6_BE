const express = require('express');
const dotenv = require("dotenv");
const path = require('path');
const cors = require('cors')
const auth = require('./Routes/auth.router');
const user = require('./Routes/user.router');
const icon = require('./Routes/icon.router');
const currency = require('./Routes/currency.router');
const wallet = require('./Routes/wallet.router');
const category = require('./Routes/category.router');
const myAccount =  require('./Routes/my-account.router')
const connectDB = require('./config/db.config')
const passport = require('passport');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const transaction = require('./Routes/transaction.router')

const app = express();
const PORT = process.env.PORT || 8080
dotenv.config();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.get('/', function(req, res) {
    res.send('Page under construction.');
});



app.use('/auth', auth);
app.use('/icon', icon);
app.use('/user', user);
app.use('/currency', currency);
app.use('/wallet', wallet);
app.use('/my-account', myAccount);
app.use('/transaction',transaction);
app.use('/category',category);
//middleware
// app.use('/api', passport.authenticate('jwt', { session: false}), book);

connectDB().then(() => {
    console.log('database connected');
})

// catch 404 and forward to error handler
app.use(function(err, req, res, next) {
    console.log(req.url + 'Not Found', err.message);
    err.status = 404;
    res.status(404).json(err.message);
});


app.listen(PORT,()=>{
    console.log(`server is listing on ${PORT}`)
    }
)
module.exports = app;
