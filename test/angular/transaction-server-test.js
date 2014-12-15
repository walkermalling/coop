'use strict';

require('../../app/app.js');
require('angular-mocks');

describe('transaction-server service', function() {

  beforeEach(angular.mock.module('coop'));

  var server;
  var $httpBackend;

  beforeEach(angular.mock.inject(function(transactionServer, _$httpBackend_) {
    server = transactionServer;
    $httpBackend = _$httpBackend_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should make a get request', function() {
    $httpBackend.expectGET('/transactions').respond(200, [{}]);
    server.collection();

    $httpBackend.flush();    
  });



});