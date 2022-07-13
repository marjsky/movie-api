const passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    Models = require('./models.js'),
    passportJWT = require('passport-jwt');

let Users = Models.User,
    JWTStrategy = passportJWT.Strategy,
    ExtractJWT = passportJWT.ExtractJwt;

//defines baslic HTTP authentication for login requests
passport.use(new LocalStrategy({ //takes username and password from request body
    usernameField: 'Username',
    passwordField: 'Password',
}, (username, password, callback) => {
    console.log(username + ' ' + password);
    Users.findOne({ Username: username }, (error, user) => { //use Mongoose to check database
        if(error) {
            console.log(error);
            return callback(error);
        }
        if (!user) {
            console.log('incorrect username');
            return callback(null, false, {message: 'Incorrect username or password.'});
        }
        if (!user.validatePassword(password)) {
            console.log('incorrect password');
            return callback(null, false, {message: 'Incorrect password.'});
        }
        console.log('finished');
        return callback(null, user);
    });
}));

//JWT authentication 
passport.use(new JWTStrategy({ //to authenticate users on JWT submitted request
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(), // JWT take from header of HTTP request
    secretOrKey: 'your_jwt_secret' //to verify the signature of JWT
}, (jwtPlayload, callback) => {
    return Users.findById(jwtPlayload._id)
    .then((user) => {
        return callback(null, user);
    })
    .catch((error) => {
        return callback(error)
    });
}));