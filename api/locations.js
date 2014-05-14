var mongoose  = require('mongoose')
 ,  Schema    = mongoose.Schema
 ,  shortId   = require('shortid')
 ,  auth      = require('./auth')
 ,  Resource  = require('./resource');

// Setup the use model.
var Location = exports.Location = mongoose.model('Location', {
    _id: { type: String, default: shortId.generate },
    title: String,
    hours: {
        monday: [Number],
        tuesday: [Number],
        wednesday: [Number],
        thursday: [Number],
        friday: [Number]
    }
});

exports.setup = function (app) {
    app.get('/api/locations',                              Resource.list(Location));
    app.post('/api/locations',       auth.isAuthenticated, Resource.add(Location));
    app.put('/api/locations/:id',    auth.isAuthenticated, Resource.update(Location));
    app.delete('/api/locations/:id', auth.isAuthenticated, Resource.remove(Location));
};
