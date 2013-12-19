var app     = require('../../app').app
  , Staff   = require('../staff').Staff
  , request = require('supertest');

describe('/api/staff', function () {
    // clear the database
    var staff;
    beforeEach(function() {
        Staff.remove().exec();
        staff = new Staff({
            name: 'jane doe',
            email: 'jane@doe.com'
        });
        staff.save();
    });
    it('should be able to list all staff members.', function (done) {
        request(app)
            .get('/api/staff')
            .set('Accept', 'application/json')
            .end(function (err, res) {
                expect(res.body.length).toBe(1);
                done();
            });
    });
    it('should be able to add a staff member.', function (done) {
        var staff = { name: 'john doe', email: 'john@doe.com'};
        request(app)
            .post('/api/staff')
            .set('Accept', 'application/json')
            .send(staff)
            .end(function (err, res) {
                expect(res.body._id).not.toBe(undefined);
                expect(res.body.name).toBe(staff.name);
                expect(res.body.email).toBe(staff.email);
                done();
            });
    });
    it('should be able to remove a staff member.', function (done) {
        request(app)
            .del('/api/staff/'+staff._id)
            .set('Accept', 'application/json')
            .end(function (err, res) {
                expect(res.body._id).toBe(''+staff._id);
                expect(res.body.name).toBe(staff.name);
                expect(res.body.email).toBe(staff.email);
                done();
            });
    });
});
