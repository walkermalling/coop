'use strict';

module.exports = function(app){

  app.controller('memberController', ['$scope', '$http', 
    function($scope, $http) {

      $scope.members = {};
      $scope.getAllMembers = function () {
        $http.get('/members')
          .success(function (data) {
            $scope.members = data;
          })
          .error(function (data) {
            console.log('error fetching members');
            console.log(data);
          });
      };

      $scope.getAllMembers();

    }
  ]);
};