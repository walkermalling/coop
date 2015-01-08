'use strict';

module.exports = function (app) {

  app.directive('headerBlock', function () {
    return {
      restrict: 'E',
      templateUrl: 'templates/header-template.html'
    };
  });

};