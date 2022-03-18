const jwt = require('jsonwebtoken');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const jwtConfig = require('../config/jwt.env');
const database = require('../config/database.config.js');

function generateToken(user) {
    const token = jwt.sign({ user_id: user._id },
        jwtConfig.secretKey, {
            expiresIn: "2h",
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

function startSession(user) {
    session({
        secret: user.email_id,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: true },
        store: MongoStore.create({
            mongoUrl: database.url
        })
    });
}

function verifySession(req, res, next) {
    if (req.method != 'POST') {
        if (req.session) {
            next();
        } else {
            res.send("Session is invalid, Please Login again!")
        }
    } else {
        next();
    }
}

module.exports = { generateToken, verifyToken, startSession, verifySession };