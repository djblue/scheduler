var mongoose  = require('mongoose')
 ,  Schema    = mongoose.Schema
 ,  auth      = require('./auth')
 ,  _         = require('underscore');

// Setup the use model.
var User = exports.User = mongoose.model('User', {
    admin: Boolean,
    username: String,
    firstname: String,
    lastname: String,
    password: String,
    email: String,
});

exports.setup = function (app) {
    app.get('/api/user', auth.isAuthenticated, function (req, res) {
        res.json(req.user);
    });
};
