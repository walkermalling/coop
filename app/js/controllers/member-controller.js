'use strict';

var _ = require('lodash');

module.exports = function(app){

  app.controller('memberController', ['$scope', '$http', '$route',
    function($scope, $http, $route) {

      $scope.members = {};
      $scope.singleMember = false;


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

      $scope.getAllMembers();


      $scope.getMember = function (id) {
        $http.get('/members/' + id)
          .success(function (data) {
            $scope.singleMember = data;
          })
          .error(function (data) {
            console.log('error fetching member');
            console.log(data);
          });
      };

    }
  ]);
};