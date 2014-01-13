var mongoose  = require('mongoose')
 ,  Schema    = mongoose.Schema
 ,  auth      = require('./auth')
 ,  _         = require('underscore')
 ,  mongooseTypes = require("mongoose-types")
 , Location   = require('./locations').Location
 , Course     = require('./courses').Course
 , log        = require('./log');
 //, nodemailer = require("nodemailer");

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

            if (err) {
                res.json(500, err);
                return;
            }

            log.write('Staff Added', staff.name + ' was added.');

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
            log.write('Staff Removed', staff.name + ' was removed.');
            res.json(staff);
        }
    }); 
};

var updateMany = function (req, res) {
    _.each(req.body, function (staff) {
        Staff.findByIdAndUpdate(staff._id, _.omit(staff, '_id'))
            .exec(function (err) {
                if (err) {
                    res.json(500, err);
                }
            });
    });
    log.write('Staff Updated','Many staff were updated.');
    res.json(200);
};

var update = function (req, res) { 
    Staff.findByIdAndUpdate(req.params.id, req.body)
        .exec(function (err, staff) {
            if (err) {
                res.json(500, err);
            } else {
                log.write('Staff Updated', staff.name + ' was updated.');
                res.json(200, staff);
            }
        });
};

/*
var requestHoursById = function (req, res) {
    
    // create transport method
    var smtpTransport = nodemailer.createTransport("SMTP",{
        service: "Gmail",
        auth: {
            user: req.body.user,
            pass: req.body.pass
        }
    });

    Staff.findById(req.params.id)
        .exec(function (err, staff) {
            smtpTransport.sendMail({
                from: req.body.user,
                to: staff.email,
                subject: 'Please Submit your Hours',
                html: 'Please go to <a href="https://djblue.us/staff/'+ 
                      staff._id +
                      '">this link</a> and fill out your availability.'
            }, function (err, response) {
                if (err) {
                    res.json(err);
                } else {
                    res.json(response);
                }
            });
        });
    
};*/

var listStaff = function (req, res) {

    Staff.find({editable: true})
        .exec(function (err, staff) {

            if (err) {
                res.end(500);
            }

            res.render('staffIndex', {
                title: 'Staff Index',
                staff: _.sortBy(staff, 'name')
            });
    });
};

var getHours = function (req, res) {

    Staff.findById(req.params.id)
        .populate('major')
        .populate('location')
        .exec(function (err, staff) {
            if (staff.editable) {
                if (err) {
                    res.json(500,err);
                } else {
                    Course.find({ location: staff.location._id })
                        .populate('subject')
                        .exec(function (err, courses) {
                            if (err) {
                                res.json(500,err);
                            } else {
                                res.render('hours', {
                                    staff: JSON.stringify(staff),
                                    courses: JSON.stringify(courses)
                                });
                            }
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
    Staff.findByIdAndUpdate(req.params.id, req.body)
        .exec(function (err, staff) {
            if (err) {
                res.json(500, err);
            } else {
                res.json(200, staff);
                log.write('Staff Updated',
                    staff.name + ' submitted their hours.');
            }
        });
};

var search = function (req, res) {
    res.render('search', {
        title: 'search'
    });
};

exports.setup = function (app) {
    app.get('/api/staff', list);
    app.post('/api/staff', add);
    app.put('/api/staff', updateMany);
    app.put('/api/staff/:id', update);
    app.delete('/api/staff/:id', remove);

    //app.post('/api/email/:id', requestHoursById);

    app.get('/staff', listStaff);
    app.get('/staff/:id', getHours);
    app.post('/staff/:id', submitHours);
    app.get('/search', search);
};
