//process.env.NODE_ENV = 'test'; 
//console.log("env2 : "+process.env.NODE_ENV);
// npm run nodemontest

var chai = require('chai');
var chaiHttp = require('chai-http');
const app = require('../app.js'); 
const server = require('../app.js').server;
var should = chai.should();
const expect = require('chai').expect;

describe('API test for MIB get', function () {

    before(function (done) {
        console.log("Before test2");
        // userRegisterModel.userAccountDetails.remove({}, (err) => {
        //     userRegisterModel.userProfile.remove({}, (err) => {
        //         done();
        //     });
        // });
        done();
    });

    after(function (done) {
        console.log("After test2");
        server.close();
        done();
    });


    it('should list ALL videos on /videos GET', function (done) {
        chai.request(server)
            .get('/videos')
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                done();
            });
    });

    it('should list player by id /:id GET', function (done) {
        chai.request(server)
            .get('/players/5b30cfa4b787f447e4ba7cef')
            .end(function (err, res) {
                res.should.have.status(200);
                done();
            });
    });
});

chai.use(chaiHttp);