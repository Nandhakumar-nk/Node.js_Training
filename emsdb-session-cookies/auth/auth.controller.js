const jwt = require('jsonwebtoken');

const jwtConfig = require('../config/jwt.env');

function generateToken() {
    const token = jwt.sign({ type: "Employee" },
        jwtConfig.secretKey, {
            expiresIn: "2h",
        }
    );

    return token;
}

function verifyToken(req, res, next) {
    if (req.method != 'POST') {
        const token = req.session.jwt_token;

        if (token) {
            jwt.verify(token, jwtConfig.secretKey, function(err, decoded) {
                if (err) {
                    res.status(500).send({ auth: false, message: 'Failed to authenticate token,Please login again!' });
                } else {
                    if (decoded.type === "Employee") next();
                    else res.status(500).send("Permission denied");
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