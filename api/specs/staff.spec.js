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
            email: 'jane@doe.com',
            major:  '0'
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
        var staff = { 
            major: '1', 
            name: 'john doe', 
            email: 'john@doe.com'
        };
        request(app)
            .post('/api/staff')
            .set('Accept', 'application/json')
            .send(staff)
            .end(function (err, res) {
                expect(res.status).toBe(201);
                expect(res.body._id).not.toBe(undefined);
                expect(res.body.name).toBe(staff.name);
                expect(res.body.email).toBe(staff.email);
                done();
            });
    });
    it('should be able to update a staff member.', function (done) {
        request(app)
            .put('/api/staff/'+staff._id)
            .set('Accept', 'application/json')
            .send({ editable: false })
            .end(function (err, res) {
                expect(res.status).toBe(200);
                expect(res.body._id).toBe(''+staff._id);
                expect(res.body.editable).toBe(false);
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
    it('should be able to submit hours.', function (done) {
        var data = {
            max: '20',
            phone: '867-5309',
            availability: {
                monday: [
                    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
                ],    
                tuesday: [
                    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
                ],   
                wednesday: [
                    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
                ],
                thursday: [
                    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
                ],
                friday: [
                    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
                ]
            }
        };
        request(app)
            .post('/staff/'+staff._id)
            .send(data)
            .end(function (err, res) {
                expect(res.body._id).toBe(''+staff._id);
                expect(res.body.max).toBe(data.max);
                expect(res.body.phone).toBe(data.phone);
                var res = res.body.availability;
                expect(res.monday[0]).toBe(
                    data.availability.monday[0]);
                expect(res.friday[0]).toBe(
                    data.availability.friday[0]);
                done();
            });
    });
});
