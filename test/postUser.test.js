// process.env.NODE_ENV = 'test'; 
// console.log("env1 : "+process.env.NODE_ENV);
var chai = require('chai');
var chaiHttp = require('chai-http');
const app = require('../app.js');
var should = chai.should();
const appRoot = require('app-root-path');
const userRegisterModel = require(appRoot + '/DataModel/UserDetailsSchema');

chai.use(chaiHttp);

describe('API test for MIB post', function () {

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
        done();
    });

    it('Registering the user', (done) => {
        let user = {
            email: "nishanth.ma@mindtree.com",
            fullName: "Nishanth Kumar",
            password: "1234"
        }
        chai.request(app)
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
        chai.request(app)
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