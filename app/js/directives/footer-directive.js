'use strict';

module.exports = function (app) {

  app.directive('footerBlock', function () {
    return {
      restrict: 'E',
      templateUrl: 'templates/footer-template.html'
    };
  });

};