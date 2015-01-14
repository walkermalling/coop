'use strict';

var _ = require('lodash');

module.exports = function (app) {

  app.controller('memberController', 
    ['$scope', '$http', 'memberServer',
    function ($scope, $http, memberServer) {

      $scope.members = {};
      var sortKey;

      /**
       * Request the members collection
       */

      $scope.getAllMembers = function () {
        memberServer.collection().success(function (data) {
          $scope.members = _.sortBy(data, 'memberId');
          sortKey = 'memberId';
          indexify($scope.members);
        });
      };

      /**
       * Sort the members collection by a given field
       *
       * If the collection is already sorted by the requested field,
       * reverse the sort
       *
       * Note: this is triggered in the view
       */

      $scope.sort = function (field) {
        if (sortKey === field ) {
          console.log('already sorteb by ' + field);
          $scope.members = $scope.members.reverse();
        } else {
          sortKey = field;
          $scope.members = _.sortBy($scope.members, field);
        }
      };

      /**
       * Take the instance counts out of their 'stats' namespace
       * so that they can serve as sortable indexes for the collection
       */

      function indexify(collection) {
        collection.forEach(function (member) {
          member.points = member.stats.points;
          member.providerInstances = member.stats.providerInstances;
          member.receiverInstances = member.stats.receiverInstances;
        });
      }

      // execute
      
      $scope.getAllMembers();

    }
  ]);
};