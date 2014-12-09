'use strict';

// var _ = require('lodash');

module.exports = function(app){

  app.controller('recommendationController', ['$scope', '$http', '$routeParams',
    function($scope, $http, $routeParams) {

      $scope.errs = [];

      /**
       *  Methods
       */

      $scope.getMember = function (id) {
        console.log('id: ' + id);
        $http.get('/members/' + id)
          .success(function (data) {
            $scope.member = data;
            console.log(data);
          })
          .error(function (data) {
            console.log('error fetching member');
            $scope.errs.push('Error fetching member information.');
            console.log(data);
          });
      };

      /**
       *  Execution
       */
      
      
      if ( $routeParams.id ) $scope.getMember($routeParams.id);
      else $scope.errs.push('No member id.');

    }
  ]);
};