var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

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
            if (user.local.password != password) {
                console.log('log in failed - user password is not a valid');
                return done(null, false);
            }
            return done(null, user);
        });
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
    new User({
        local : {
            email: req.body.username,
            password: req.body.password,
        }
    }).save(function (err, post, count) {
        passport.authenticate('local')(req, res, function() {
            res.redirect('/');
        });
    });
})

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
