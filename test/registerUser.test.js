// process.env.NODE_ENV = 'test'; 
// console.log("env1 : "+process.env.NODE_ENV);
var chai = require('chai');
var chaiHttp = require('chai-http');
const app = require('../app.js');
const server = require('../app.js').server;
var should = chai.should();
const appRoot = require('app-root-path');
const userRegisterModel = require(appRoot + '/DataModel/UserDetailsSchema');

chai.use(chaiHttp);

describe('Testing the registering flow', function () {

    before(function (done) {
        console.log("Before test");
        userRegisterModel.userAccountDetails.remove({}, (err) => {
            userRegisterModel.userProfile.remove({}, (err) => {
                done();
            });
        });
        // done();
    });

    after(function (done) {
        console.log("After test");
        server.close();
        done();
    });

    it('Registering the user', (done) => {
        let user = {
            email: "nishanth.ma@mindtree.com",
            fullName: "Nishanth Kumar",
            password: "1234"
        }
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

    it('Registering same user once again', (done) => {
        let user = {
            email: "nishanth.ma@mindtree.com",
            fullName: "Nishanth Kumar",
            password: "1234"
        }
        chai.request(server)
            .post('/common/register')
            .set('Content-Type', 'application/json')
            .send(user)
            .end((err, res) => {
                res.should.have.status(405);
                res.body.should.be.a('object');
                done();
            });
    });
});