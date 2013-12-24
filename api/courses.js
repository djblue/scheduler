var mongoose  = require('mongoose')
 ,  Schema    = mongoose.Schema
 ,  Subject   = require('./subjects').Subject;

// Setup the use model.
var Course = exports.Course = mongoose.model('Course', {
    _id: String,
    subject: {type: String, ref: 'Subject'},
    number: { type:String },
    title: String
});

var list = function (req, res) {
    Course.find()
        .populate('subject')
        .exec(function (err, staff) {
            if (err) {
                res.json(err);
            } else {
                res.json(staff);
            }
        });
};

exports.setup = function (app) {
    app.get('/api/courses', list);
};
