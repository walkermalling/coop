'use strict';

var _ = require('lodash');

module.exports = function(app){

  app.controller('memberController', ['$scope', '$http',
    function($scope, $http) {

      /*
       *  Methods
       */

      $scope.getAllMembers = function () {
        $http.get('/members')
          .success(function (data) {
            $scope.members = _.sortBy(data, 'memberId');
          })
          .error(function (data) {
            console.log('error fetching members');
            console.log(data);
          });
      };


      /*
       *  Execution
       */
      
      $scope.getAllMembers();

    }
  ]);
};