'use strict';

var _ = require('lodash');

module.exports = function(app){

  app.controller('recommendationController', ['$scope', '$http', '$routeParams',
    function($scope, $http, $routeParams) {

      $scope.msgs = [];
      $scope.member = null;
      $scope.receiverTransactions = null;
      $scope.stats = {};

      /**
       *  Methods
       */

      $scope.getMember = function (id) {
        $http.get('/members/' + id)
          .success(function (data) {
            $scope.member = data.member;
            $scope.receiverTransactions = data.receiverTransactions;
            $scope.recommend();
          })
          .error(function (err) {
            $scope.msgs.push('Error fetching member information.');
            console.log(err);
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
      else $scope.msgs.push('No member id.');

    }
  ]);
};