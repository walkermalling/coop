'use strict';

module.exports = function (app) {

  app.directive('recommendationCard', function () {
    return {
      restrict: 'E',
      templateUrl: 'templates/recommendation-card-template.html',
      controller: 'recommendationCardController',
      scope: {}
    };
  });

};