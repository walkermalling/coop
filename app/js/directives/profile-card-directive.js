'use strict';

module.exports = function(app){

  app.directive('profileCard', function() {
    return {
      restrict: 'E',
      templateUrl: 'templates/profile-card-template.html',
      controller: 'profileCardController',
      scope: {
        
      }
    };
  });

};