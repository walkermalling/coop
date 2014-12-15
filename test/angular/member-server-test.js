'use strict';

require('../../app/app.js');
require('angular-mocks');

describe('member-server service', function() {

  beforeEach(angular.mock.module('coop'));

  var server;
  var $httpBackend;

  beforeEach(angular.mock.inject(function(memberServer, _$httpBackend_) {
    server = memberServer;
    $httpBackend = _$httpBackend_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should make a get request', function() {
    $httpBackend.expectGET('/members').respond(200, [{}]);
    server.collection();

    $httpBackend.flush();    
  });

  it('should make a get request', function() {
    $httpBackend.expectGET('/members/0').respond(200, [{}]);
    server.getOne(0);

    $httpBackend.flush();    
  });

});