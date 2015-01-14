'use strict';

var _ = require('lodash');

module.exports = function (app) {

  app.controller('profileCardController', 
    ['$scope', '$routeParams', 'memberServer',
    function ($scope, $routeParams, memberServer) {

      $scope.extras = {'show' : false};

      // get the requested member and link it to the scope.user

      $scope.getMember = function (id) {
        memberServer.getOne(id).success(function (data) {
          $scope.user = data.member;
          $scope.user.trxs = data.receiverTransactions;
          $scope.user.mostRecent = _.sortBy($scope.user.trxs, 'startedAt')[$scope.user.trxs.length - 1];
          $scope.user.mostRecent.date = new Date($scope.user.mostRecent.startedAt);
          console.log($scope.user.mostRecent);
        });
      };

      if ($routeParams.id) $scope.getMember($routeParams.id);

    }
  ]);
};