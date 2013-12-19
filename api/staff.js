var mongoose  = require('mongoose')
 ,  Schema    = mongoose.Schema
 ,  auth      = require('./auth')
 ,  _         = require('underscore')
 ,  mongooseTypes = require("mongoose-types");

mongooseTypes.loadTypes(mongoose);

// Setup the use model.
var Staff = exports.Staff = mongoose.model('Staff', {
    name: { type:String, required: true },
    email: { type: mongoose.SchemaTypes.Email, required: true },
    classes: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
    availavility: [String],
    schedule: [String]
});

var list = function (req, res) {
    Staff.find()
        .exec(function (err, staff) {
            if (err) {
                res.json(err);
            } else {
                res.json(staff);
            }
        });
};

// add a staff member to the database
var add = function (req, res) {
    if (!req.body.name) {
        res.json(400, {
            message: '\'name\' field required to add staff.'
        });
    } else if (!req.body.email) {
        res.json(400, {
            message: '\'email\' field required to add staff.'
        });
    } else {
        Staff.create({
            name: req.body.name,
            email: req.body.email
        }, function (err, staff) {
            if (err) {
                res.json(500, {
                    message: 'create error',
                    error: err
                });
            } else {
                res.json(201, staff);
            }
        });
    }
}; 

var remove = function (req, res) {
    Staff.findByIdAndRemove(req.params.id, function (err, staff) {
        if (err) {
            res.json(err);
        } else {
            res.json(staff);
        }
    }); 
};

exports.setup = function (app) {
    app.get('/api/staff', list);
    app.post('/api/staff', add);
    app.delete('/api/staff/:id', remove);
};


