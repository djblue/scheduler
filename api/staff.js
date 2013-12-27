var mongoose  = require('mongoose')
 ,  Schema    = mongoose.Schema
 ,  auth      = require('./auth')
 ,  _         = require('underscore')
 ,  mongooseTypes = require("mongoose-types")
 , Location   = require('./locations').Location;

mongooseTypes.loadTypes(mongoose);

// Setup the use model.
var Staff = exports.Staff = mongoose.model('Staff', {
    editable: { type: Boolean, default: true },
    name: { type: String, required: true },
    email: { type: mongoose.SchemaTypes.Email, required: true },
    major: { type: String, ref: 'Subject', required: true },
    location: { type: String, ref: 'Location', required: true },
    courses: [{ type: String, ref: 'Course' }],
    availability: {
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: []
    },
    schedule: {
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: []
    },
    max: String,
    phone: String
});

var list = function (req, res) {
    Staff.find()
        .populate('major')
        .populate('courses')
        .populate('location')
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
    } else if (!req.body.major) {
        res.json(400, {
            message: '\'email\' field required to add staff.'
        });
    } else if (!req.body.location) {
        res.json(400, {
            message: '\'email\' field required to add staff.'
        });
    } else {

        Staff.create({
            name: req.body.name,
            email: req.body.email,
            major: req.body.major,
            location: req.body.location
        }, function (err, staff) {

            Staff.findById(staff._id)
                .populate('major')
                .populate('courses')
                .populate('location')
                .exec(function (err, staff) {
                    if (err) {
                        res.json(500, {
                            message: 'create error',
                            error: err
                        });
                    } else {
                        res.json(201, staff);
                    }
                });  
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

var update = function (req, res) { 
    Staff.findByIdAndUpdate(req.params.id, req.body)
        .exec(function (err, staff) {
            if (err) {
                res.json(500, err);
            } else {
                res.json(200, staff);
            }
        });
};

var getHours = function (req, res) {

    Staff.findById(req.params.id)
        .populate('major')
        .exec(function (err, staff) {
            if (staff.editable) {
                if (err) {
                    res.json(500,err);
                } else {
                    res.render('hours', {
                        staff: JSON.stringify(staff)
                    });
                }
            } else {
                res.render('error', {
                    message: 'Sorry. You are unable to edit your hours at the current time'
                });
            }
    });

};

var submitHours = function (req, res) {
    console.log(_.pick( req.body, 'availability', 'courses', 'phone', 'max'));
    Staff.findByIdAndUpdate(req.params.id, req.body)
        .exec(function (err, staff) {
            if (err) {
                res.json(500, err);
            } else {
                res.json(200, staff);
            }
        });
};

exports.setup = function (app) {
    app.get('/api/staff', list);
    app.post('/api/staff', add);
    app.put('/api/staff/:id', update);
    app.delete('/api/staff/:id', remove);

    app.get('/staff/:id', getHours);
    app.post('/staff/:id', submitHours);
};
