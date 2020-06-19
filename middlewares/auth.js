const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
    const token = req.header('x-auth-token');

    if (!token) {
        return res.status(401).json({ msg: 'No token,authorization denied' })
    }

    try {
        jwt.verify(token, config.get("jwtSecret"), (err, decoded) => {

            // if(err.name == 'TokenExpiredError') {
            //     return res.status(400).json({status: false, msg: 'Token Expired', data: null, statusCode: 400 });    
            // }
            req.user = decoded.user;
            next();
        });

        
    } catch (error) {
        res.status(401).json({status: false, msg: 'Token is not valid', data: null, statusCode: 401 });
    }
}