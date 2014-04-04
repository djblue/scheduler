var passport        = exports.passport = require('passport')
  , LocalStrategy   = require('passport-local').Strategy
  , User            = require('./users').User;

passport.use(new LocalStrategy(
    function(username, password, done) {
        User.findOne({ username: username }, function(err, user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { 
                    message: 'Incorrect username.' });
            }
            if (user.password !== password) {
                return done(null, false, { 
                    message: 'Incorrect password.' });
            }
            return done(null, user);
        });
    }
));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id)
        exec(function(err, user) {
            done(err, user);
    });
});

exports.isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) { 
        return next(null); 
    } else {
        res.redirect('/login');
    }
};

exports.isAdmin = function (req, res, next) {
    if (req.isAuthenticated() && req.user.admin === true) { 
        return next(null); 
    } else {
        res.redirect('/');
    }
};

exports.setup = function (app) {

    // Setup login route
    app.post('/api/login', passport.authenticate('local', {   
        successRedirect: '/'
    })); 

    app.get('/login', function (req, res) {
        res.render('login', {
            title: 'Login'
        });
    });

    // Setup logout route
    app.get('/api/logout', function(req, res){
        req.logout();
        res.redirect('/');
    });
};
