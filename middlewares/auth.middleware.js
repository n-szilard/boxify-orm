var jwt = require('jsonwebtoken');

function ensureSecret() {
    if (!process.env.ACCESS_TOKEN_SECRET) {
        const message = 'Az ACCESS_TOKEN_SECRET nincs beállítva.';
        console.error(message);
        throw new Error(message);
    }

    return process.env.ACCESS_TOKEN_SECRET;
}

function generateToken(payload) {
    const secret = ensureSecret();
    const tokenOptions = {
        expiresIn: '1h'
    }
    return jwt.sign({payload}, secret, tokenOptions);
}

function verifyToken(token) {
    const secret = ensureSecret();
    return jwt.verify(token, secret);
}

function authenticate(req, res, next) {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.split(' ')[1];

    if (!token) {
        console.error('JWT ellenőrzés sikertelen!', { error: 'Hiányzó vagy érvénytelen token.' });
        return res.status(401).json({ error: 'Hiányzó vagy érvénytelen token.' });
    }

    try {
        req.user = verifyToken(token);
        next();
    } catch (error) {
        console.error('JWT ellenőrzés sikertelen!', { error: error.message });
        return res.status(401).json({ error: 'Érvénytelen vagy lejárt token.' });
    }
}


module.exports = {
    generateToken,
    verifyToken,
    authenticate
}