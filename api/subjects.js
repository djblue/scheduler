var mongoose  = require('mongoose')
 ,  Schema    = mongoose.Schema
 , shortId    = require('shortid')
 ,  auth      = require('./auth')
 ,  Resource  = require('./resource');

// Setup the use model.
var subjectSchema = Schema({
    _id: { type: String, default: shortId.generate },
    title: String,
    prefix: String
});

subjectSchema.pre('remove', function (next) {
    this.model('Course').find({ subject: this._id }, function (err, models) {
        models.forEach(function (model) { model.remove(); });
        next();
    }); 
});

var Subject = exports.Subject = mongoose.model('Subject', subjectSchema);

exports.setup = function (app) {
    app.get('/api/subjects',                              Resource.list(Subject));
    app.post('/api/subjects',       auth.isAuthenticated, Resource.add(Subject));
    app.put('/api/subjects/:id',    auth.isAuthenticated, Resource.update(Subject));
    app.delete('/api/subjects/:id', auth.isAuthenticated, Resource.remove(Subject));
};
