'use strict';

var _ = require('lodash');

module.exports = function(app){

  app.controller('recommendationController', 
    ['$scope', '$http', '$routeParams', 'memberServer',
    function($scope, $http, $routeParams, memberServer) {

      $scope.user = null;
      $scope.receiverTransactions = null;
      $scope.stats = {};

      /**
       *  Methods
       */

      $scope.getMember = function (id) {
        memberServer.getOne(id)
          .success(function (data) {
            $scope.user = data.member;
            $scope.receiverTransactions = data.receiverTransactions;
            $scope.recommend();
          });
      };

      $scope.sortTrxsBy = function (key) {
        $scope.receiverTransactions = _.sortBy($scope.receiverTransactions, key);
      };

      $scope.recommend = function () {
        $scope.stats.freq = _.countBy($scope.receiverTransactions, function (trx) {
          return trx.sittingProviderId;
        });
      };

      /**
       *  Execution
       */
      
      if ( $routeParams.id ) $scope.getMember($routeParams.id);

    }
  ]);
};