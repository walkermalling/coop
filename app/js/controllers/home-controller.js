'use strict';

module.exports = function(app){

  app.controller('homeController', ['$scope', function($scope) {

    $scope.dummydata = {
      'test' : 'asdlkfjasldkfj'
    };

  }]);
};