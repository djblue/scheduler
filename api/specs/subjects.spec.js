var app     = require('../../app').app
  , request = require('supertest')
  , agent   = request.agent(app)
  , User    = require('../users').User 
  , Course  = require('../courses').Course
  , Subject = require('../subjects').Subject;


var auth = new User({ username: 'root', password: 'password' });
auth.save();

describe('/api/subjects', function () {

    var subject, course, course_safe;
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
        course_safe = new Course({
            _id: '1',
            subject: '1',
            number: '0',
            title: 'title',
            location: '0'
        });
        course_safe.save();
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
    it('should let you get subjects.', function (done) {
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
    it('should let you update subjects.', function (done) {
        agent
            .put('/api/subjects/'+subject._id)
            .send({ title: 'new title'})
            .end(function (err, res) {
                expect(res.status).toBe(200);
                expect(res.body.title).toBe('new title');
                done();
            });
    });
    it('should cleanup dependents on delete.', function (done) {
        agent
            .del('/api/subjects/'+subject._id)
            .end(function (err, res) {
                expect(res.status).toBe(200);
                expect(res.body).not.toBe(null);
                expect(res.body._id).toBe(subject._id);
                expect(res.body.title).toBe(subject.title);
                expect(res.body.prefix).toBe(subject.prefix);
                Subject.findById(subject._id, function (err, subject) {
                    expect(subject).toBe(null);
                    done();
                });
                // should not be able to find document
                Course.findById(course._id, function (err, course) {
                    expect(course).toBe(null);
                    done();
                });
                Course.findById(course_safe._id, function (err, course) {
                    expect(err).toBe(null);
                    expect(course._id).toBe(course_safe._id);
                    expect(course.title).toBe(course_safe.title);
                    expect(course.prefix).toBe(course_safe.prefix);
                    done();
                });
            });
    });
});
