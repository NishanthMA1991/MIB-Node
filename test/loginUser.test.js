var chai = require('chai');
var chaiHttp = require('chai-http');
const app = require('../app.js');
const server = require('../app.js').server;
const expect = require('chai').expect;
var should = chai.should();
const appRoot = require('app-root-path');
const userRegisterModel = require(appRoot + '/DataModel/UserDetailsSchema');

var user = {
    email: "nishanth.ma@mindtree.com",
    fullName: "Nishanth Kumar",
    password: "1234"
}

describe('Register user and login', function () {
    before(function (done) {
        console.log("Before test Register");
        userRegisterModel.userAccountDetails.remove({}, (err) => {
            userRegisterModel.userProfile.remove({}, (err) => {
                done();
            });
        });
        // done();
    });

    after(function (done) {
        console.log("After test Register");
        server.close();
        done();
    });

    it('Registering the user', (done) => {
        chai.request(server)
            .post('/common/register')
            .set('Content-Type', 'application/json')
            .send(user)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
            });
    });

    it('should Login with register details', (done)  =>  {
        chai.request(server)
            .post('/common/login')
            .set('Content-Type', 'application/json')
            .send(user)
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res).to.have.header('x_Token');
                expect(res).to.be.json;
                done();
                // expect(res.body).toEqual({
                //     message:  'Inside The routes'
                // })
            })
    });
}); 
