const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt.env');

function generateToken(user) {
    const token = jwt.sign({ user_id: user._id },
        jwtConfig.secretKey, {
            expiresIn: "300s",
        }
    );

    return token;
}

function verifyToken(req, res, next) {
    if (req.method != 'POST') {
        const token = req.headers['x-access-token'];

        if (token) {
            jwt.verify(token, jwtConfig.secretKey, function(err, decoded) {
                if (err) {
                    res.status(500).send({ auth: false, message: 'Failed to authenticate token,Please login again!' });
                } else {
                    next();
                }
            });
        } else {
            res.status(401).send({ auth: false, message: 'No token provided.Please Login to generate token' });
        }
    } else {
        next();
    }
}

module.exports = { generateToken, verifyToken };