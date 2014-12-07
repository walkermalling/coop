'use strict';

module.exports = function(app){

  app.controller('transactionController', ['$scope', '$http', 
    function($scope, $http) {

      $scope.transactions = {};
      $scope.getAllTransactions = function () {
        $http.get('/transactions')
          .success(function (data) {
            $scope.transactions = data;
          })
          .error(function (data) {
            console.log('error fetching transactions');
            console.log(data);
          });
      };

      $scope.getAllTransactions();

    }
  ]);
};