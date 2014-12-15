var appRoot = require('app-root-path');
require('../../../server');
var chai = require('chai');
var chaihttp = require('chai-http');
chai.use(chaihttp);
var expect = chai.expect;

describe('transaction-routes', function() {
  
  var id;

  it('gets the transaction collection', function(done) {
    chai.request('http://localhost:3000')
      .get('/transactions')
      .end(function(err, res) {
        expect(res).to.have.status(200);
        expect(Array.isArray(res.body)).to.be.true;
        expect(res.body[0]).to.have.property('childrenWatched');
        expect(res.body[0]).to.have.property('duration');
        expect(res.body[0]).to.have.property('sittingProviderId');
        expect(res.body[0]).to.have.property('sittingReceiverId');
        expect(res.body[0]).to.have.property('startedAt');
        expect(res.body[0]).to.have.property('offsetMinutes');
        expect(res.body[0]).to.have.property('createdAt');
        done();
      });
    });

});