var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var bcrypt = require('bcryptjs');
var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth20').Strategy;

var User = mongoose.model('User');
var router = express.Router();

passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    }, function(username, password, done) {
        User.findOne({'local.email': username}).exec(function (err, user) {
            if (err) return done(err);
            if (!user) {
                console.log('log in failed - user is not a valid');
                return done(null, false);
            }
            bcrypt.compare(password, user.local.password, function(err, res) {
                if (err) return done(null, false);
                if (res) return done(null, user);
                else return done(null, false);
            });
        });
    }
));
passport.use(new GoogleStrategy({
        clientID: '835233503205-1v5ops08nfnqsb8jm1uvoie8lqu6i2hb.apps.googleusercontent.com',
        clientSecret: 'IWzxYRsDeUAieJFuoF3brzaz',
        callbackURL: 'http://localhost:3000/auth/google/callback'
    },
    function(accessToken, refreshToken, profile, cb) {
        return cb(null, profile);
    }
));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    User.findById(user._id).exec(function(err, user) {
        done(null, user);
    });
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.get('/signup', function(req, res) {
    res.render('signup');
})

router.post('/signup', function(req, res) {
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(req.body.password, salt, function(err, hash) {
            new User({
                local : {
                    email: req.body.username,
                    password: hash,
                    salt: salt
                }
            }).save(function (err, post, count) {
                passport.authenticate('local')(req, res, function() {
                    res.redirect('/');
                });
            });
        });
    });

});

router.get('/google',
    passport.authenticate('google',
        { scope:
            ['email profile']
        }
    )
);

router.get('/google/callback',
    passport.authenticate('google', {failureRedirect: '/users/loginFailure'}),
    function(req, res) {
        res.redirect('/');
    }
);

router.post('/login', passport.authenticate('local', {
    successRedirect : '/',
    failureRedirect : '/users/loginFailure'
}));

router.get('/loginFailure', function(req, res, next) {
    res.send('Failed to authenticate');
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});


module.exports = router;
