const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) =>{
    const authHeader = req.header('Authorization');
    const token = authHeader.split(' ')[1];
    console.log(token)
    if (!token)
        return res.status(401).json({success: false, message: 'acces token not found'})
    try {
        const payload = jwt.verify(token, process.env.SECRET_KEY);
        console.log(payload)
        req.user = payload;
        next()
    } catch (err) {
        console.log(err)
        return res.status(403).json({success: false, message: 'token ko hop le'})
    }
}

module.exports = verifyToken