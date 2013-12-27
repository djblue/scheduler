var mongoose  = require('mongoose')
 ,  Schema    = mongoose.Schema;

// Setup the use model.
var Location = exports.Location = mongoose.model('Location', {
    _id: String,
    title: String
});

var list = function (req, res) {
    Location.find()
        .exec(function (err, staff) {
            if (err) {
                res.json(err);
            } else {
                res.json(staff);
            }
        });
};

exports.setup = function (app) {
    app.get('/api/locations', list);
};