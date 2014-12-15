var appRoot = require('app-root-path');
require('../../../server');
var chai = require('chai');
var chaihttp = require('chai-http');
chai.use(chaihttp);
var expect = chai.expect;

describe('member-routes', function() {
  
  var id;

  it('gets the members collection', function(done) {
    chai.request('http://localhost:3000')
      .get('/members')
      .end(function(err, res) {
        expect(res).to.have.status(200);
        expect(Array.isArray(res.body)).to.be.true;
        expect(res.body[0]).to.have.property('memberId');
        expect(res.body[0]).to.have.property('name');
        expect(res.body[0]).to.have.property('stats');
        expect(res.body[0]).to.have.property('stats');
        done();
      });
    });

  it('gets a single member', function(done) {
    chai.request('http://localhost:3000')
      .get('/members/0')
      .end(function(err, res) {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('member');
        expect(res.body).to.have.property('receiverTransactions');
        expect(res.body).to.have.property('member');
        expect(res.body).to.have.property('receiverTransactions');
        expect(Array.isArray(res.body.receiverTransactions)).to.be.true;
        done();
      });
    });

});