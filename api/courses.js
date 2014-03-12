var mongoose  = require('mongoose')
 ,  Schema    = mongoose.Schema
 ,  Subject   = require('./subjects').Subject;

// Setup the use model.
var Course = exports.Course = mongoose.model('Course', {
    _id: String,
    subject: {type: String, ref: 'Subject'},
    number: { type:String },
    title: String,
    location: { type: String, ref: 'Location' }
});

var list = function (req, res) {
    Course.find()
        .populate('subject')
        .populate('location')
        .exec(function (err, staff) {
            if (err) {
                res.json(err);
            } else {
                res.json(staff);
            }
        });
};

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
    app.get('/api/courses', list);
    app.get('/api/courses/:location', listByLocation);
};
