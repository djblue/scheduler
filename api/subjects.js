var mongoose  = require('mongoose')
 ,  Schema    = mongoose.Schema
 ,  auth      = require('./auth')
 ,  Resource  = require('./resource');

// Setup the use model.
var Subject = exports.Subject = mongoose.model('Subject', {
    _id: String,
    title: String,
    prefix: String
});

var list = function (req, res) {
    Subject.find()
        .exec(function (err, staff) {
            if (err) {
                res.json(err);
            } else {
                res.json(staff);
            }
        });
};

exports.setup = function (app) {
    app.get('/api/subjects',                              Resource.list(Subject));
    app.post('/api/subjects',       auth.isAuthenticated, Resource.add(Subject));
    app.put('/api/subjects/:id',    auth.isAuthenticated, Resource.update(Subject));
    app.delete('/api/subjects/:id', auth.isAuthenticated, Resource.remove(Subject));
};
