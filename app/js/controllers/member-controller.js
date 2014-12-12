'use strict';

var _ = require('lodash');

module.exports = function(app){

  app.controller('memberController', 
    ['$scope', '$http', 'memberServer',
    function($scope, $http, memberServer) {

      $scope.members = {};

      /*
       *  Methods
       */

      $scope.getAllMembers = function () {
        memberServer.collection().success(function (data) {
          $scope.members = _.sortBy(data, 'memberId');
        });
      };


      /*
       *  Execution
       */
      
      $scope.getAllMembers();

    }
  ]);
};