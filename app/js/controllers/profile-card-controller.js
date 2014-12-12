'use strict';

// var _ = require('lodash');

module.exports = function(app){

  app.controller('profileCardController', 
    ['$scope', '$routeParams', 'memberServer',
    function($scope, $routeParams, memberServer) {

      $scope.getMember = function (id) {
        memberServer.getOne(id).success(function (data) {
          $scope.user = data.member;
          $scope.user.trxs = data.receiverTransactions;
        });
      };

      if ( $routeParams.id ) $scope.getMember($routeParams.id);

    }
  ]);
};