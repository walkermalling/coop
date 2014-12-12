'use strict';

var _ = require('lodash');

module.exports = function(app){

  app.controller('transactionController', 
    ['$scope', '$http', 'transactionServer',
    function($scope, $http, trxServer) {

      $scope.transactions = {};
      
      $scope.getAllTransactions = function () {
        trxServer.collection().success(function (data) {
          $scope.transactions = _.sortBy(data, 'startedAt');
        });
      };

      $scope.getAllTransactions();

    }
  ]);
};