import jwt from 'jsonwebtoken';
import strings from '../models/strings.js';

const getTokenFromHeader = (req) => {
    const token = req.header("x-token");
    if (!token) {
        throw new Error(strings.auth.noTokenProvided);
    }
    return token;
};

const validateToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET_KEY);
};

export const validateJWT = (req, res, next) => {
    try {
        const token = getTokenFromHeader(req);
        const {id, name} = validateToken(token);
        req.user = {id, name};
        next();
    } catch (error) {
        const message = error.message === strings.auth.noTokenProvided ? error.message : strings.auth.invalidToken;
        res.status(401).json({ok: false, msg: message});
    }
};

export const validateJWTForNote = (req, res, next) => {
    try {
        const token = getTokenFromHeader(req);
        req.user = validateToken(token);
        next();
    } catch (error) {
        const message = error.message === strings.auth.noTokenProvided ? error.message : strings.auth.invalidToken;
        res.status(401).json({ok: false, msg: message});
    }
};
