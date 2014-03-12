var mongoose  = require('mongoose')
 ,  Schema    = mongoose.Schema
 ,  Resource  = require('./resource');


// Setup the model.
var Log = exports.Log = mongoose.model('Log', {
    title: String,
    message: String,
    time: { type: Date, default: Date.now }
});

// log event
exports.write = function (title, message) {
    Log.create({
        title: title, 
        message: message
    });
}; 

exports.setup = function (app) {
    app.get('/api/log', Resource.list(Log));
};
