var mongoose  = require('mongoose')
 ,  Schema    = mongoose.Schema
 ,  auth      = require('./auth')
 , Location   = require('./locations').Location;


// Setup the model.
var Log = exports.Log = mongoose.model('Log', {
    title: String,
    message: String,
    time: { type: Date, default: Date.now }
});

var list = function (req, res) {
    Log.find()
        .exec(function (err, staff) {
            if (err) {
                res.json(err);
            } else {
                res.json(staff);
            }
        });
};

// log event
exports.write = function (title, message) {
    Log.create({
        title: title, 
        message: message
    });
}; 

exports.setup = function (app) {
    app.get('/api/log', list);
};
