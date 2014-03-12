var app     = require('../../app').app
  , request = require('supertest')
  , User    = require('../users').User;

describe('Authentication', function () {
    var auth
    beforeEach(function() {
        User.remove().exec();
        auth = new User({
            username: 'root',
            password: 'password'
        });    
        auth.save();
    });
    it('should keep you logged out.', function (done) {
        request(app)
            .post('/api/login')
            .send({})
            .end(function (err, res) {
                expect(res.status).toBe(401);
                done();
            });
    });
    it('should let you login.', function (done) {
        request(app)
            .post('/api/login')
            .send({username: auth.username, password: auth.password})
            .end(function (err, res) {
                expect(res.status).toBe(302);
                done();
            });
    })
});
