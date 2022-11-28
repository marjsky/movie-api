const jwtSecret = 'your_jwt_secret'; // This has to be the same key used in the JWTstrategy

const jwt = require('jsonwebtoken'),
    passport = require('passport');

require('./passport.js'); // local passport file

/**
 * creates JWT at expring seven days, using algorithm to encode base on username and password
 * then send back to respond
 * @param {object} user 
 * @returns user object, jwt, and token
 */
let generateJWTToken = (user) => {
    return jwt.sign(user, jwtSecret, {
        subject: user.Username, // this is the username you're encoding in the JWT
        expiresIn: '7d', // this specifies that the token will expire in 7 days
        algorithm: 'HS256' // this is the algorithm used to "sign" or encode the values of JWT
    });
}

/**
 * User login generate jwt  logging
 * Method: POST
 * @function generateJWTToken
 * @param {*} router 
 * @requires passport
 * @returns user object with jwt
 */
module.exports = (router) => {
    router.post('/login', (req, res) => {
        passport.authenticate('local', { session: false }, (error, user, info) => {
            if (error || !user) {
                return res.status(400).json({
                    message: 'Something is not right',
                    user: user
                });
            }
            req.login(user, { session: false }, (error) => {
                if (error) {
                    res.send(error)
                }
                let token = generateJWTToken(user.toJSON());
                return res.json({ user, token}); 
            });
        })(req, res);
    });
}