'use strict';

var _ = require('lodash');

module.exports = function(app){

  app.controller('memberController', 
    ['$scope', '$http', 'memberServer',
    function($scope, $http, memberServer) {

      $scope.members = {};
      var sortKey;

      /*
       *  Methods
       */

      $scope.getAllMembers = function () {
        memberServer.collection().success(function (data) {
          $scope.members = _.sortBy(data, 'memberId');
          sortKey = 'memberId';
          indexify($scope.members);
        });
      };

      $scope.sort = function (field) {
        if (sortKey === field ) {
          console.log('already sorteb by ' + field);
          $scope.members = $scope.members.reverse();
        } else {
          sortKey = field;
          $scope.members = _.sortBy($scope.members, field);
        }
      };

      function indexify(collection) {
        collection.forEach(function (member) {
          member.points = member.stats.points;
          member.providerInstances = member.stats.providerInstances;
          member.receiverInstances = member.stats.receiverInstances;
        });
      }


      /*
       *  Execution
       */
      
      $scope.getAllMembers();


    }
  ]);
};