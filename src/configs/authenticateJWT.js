const jwt = require('jsonwebtoken');

const refreshTokenSecret = 'thisisatokensecret';

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, refreshTokenSecret, (err, user) => {
            if (err) {
                return res.json({code: 403, message: "Token is wrong in JWT!"});
            }
            req.user = user;
            next();
        });
    } else {
        res.json({code: 403, message: "Token is missing in JWT!"});
    }
};

module.exports = authenticateJWT;