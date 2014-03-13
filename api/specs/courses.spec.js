var app     = require('../../app').app
  , request = require('supertest')
  , agent   = request.agent(app)
  , User    = require('../users').User 
  , Course  = require('../courses').Course
  , Staff   = require('../staff').Staff
  , Subject = require('../subjects').Subject;


var auth = new User({ username: 'root', password: 'password' });
auth.save();

describe('/api/courses', function () {

    var subject, course, staff;
    beforeEach(function() { 
        // create default subject
        Subject.remove().exec();
        subject = new Subject({
            _id: '0',
            title: 'title',
            prefix: 'PRE'
        });
        subject.save();
        // create default course 
        Course.remove().exec();
        course = new Course({
            _id: '0',
            subject: '0',
            number: '0',
            title: 'title',
            location: '0'
        });
        course.save();
        Staff.remove().exec();
        staff = new Staff({
            name: 'name',
            major: '0',
            location: '0',
            courses: ['0']
        });
        staff.save();
    });
    it('should let you login', function (done) {
        agent
            .post('/api/login')
            .send({username: auth.username, password: auth.password})
            .end(function (err, res) {
                expect(res.status).toBe(302);
                done();
            });

    });
    it('should let you get courses.', function (done) {
        request(app)
            .get('/api/subjects')
            .end(function (err, res) {
                expect(res.status).toBe(200);
                expect(res.body[0]._id).toBe(subject._id);
                expect(res.body[0].title).toBe(subject.title);
                expect(res.body[0].prefix).toBe(subject.prefix);
                done();
            });
    });
    it('should cleanup dependents on delete.', function (done) {
        agent
            .del('/api/courses/'+course._id)
            .end(function (err, res) {
                expect(res.status).toBe(200);
                expect(res.body).not.toBe(null);
                expect(res.body._id).toBe(course._id);
                expect(res.body.number).toBe(course.number);
                expect(res.body.title).toBe(course.title);
                expect(res.body.location).toBe(course.location);

                // should not be able to find document
                Course.findById(course._id, function (err, course) {
                    expect(course).toBe(null);
                    done();
                });
                Staff.findById(staff._id, function (err, staff) {
                    expect(err).toBe(null);
                    expect(staff.courses.length).toBe(0);
                    done();
                });
                done();
            });
    });
    it('should cascade the deletions.', function (done) {
        agent
            .del('/api/subjects/'+subject._id)
            .end(function (err, res) {
                // should not be able to find document
                Course.findById(course._id, function (err, course) {
                    expect(course).toBe(null);
                    done();
                });
                Staff.findById(staff._id, function (err, staff) {
                    expect(err).toBe(null);
                    expect(staff.courses.length).toBe(0);
                    done();
                });
                done();
            });
    });
});
