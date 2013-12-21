var mongoose  = require('mongoose')
 ,  Schema    = mongoose.Schema;

// Setup the use model.
var Subject = exports.Subject = mongoose.model('Subject', {
    _id: String,
    title: String,
    prefix: String
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
