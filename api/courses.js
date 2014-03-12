var mongoose  = require('mongoose')
 ,  Schema    = mongoose.Schema
 ,  auth      = require('./auth')
 ,  Resource  = require('./resource')
 ,  Subject   = require('./subjects').Subject;

// Setup the use model.
var Course = exports.Course = mongoose.model('Course', {
    _id: String,
    subject: {type: String, ref: 'Subject'},
    number: { type:String },
    title: String,
    location: { type: String, ref: 'Location' }
});

var listByLocation = function (req, res) {
    Course.find({ location: req.params.location })
        .populate('subject')
        .exec(function (err, courses) {
            if (err) {
                res.json(err);
            } else {
                res.json(courses);
            }
        });
};

exports.setup = function (app) {
    app.get('/api/courses',                              Resource.list(Course));
    app.get('/api/courses/:location',                    listByLocation);
    app.post('/api/courses',       auth.isAuthenticated, Resource.add(Course));
    app.put('/api/courses/:id',    auth.isAuthenticated, Resource.update(Course));
    app.delete('/api/courses/:id', auth.isAuthenticated, Resource.remove(Course));
};
