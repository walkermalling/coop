'use strict';

module.exports = function(app) {
  app.factory('memberServer', function($http) {
  
    return {
      collection: function () {
        return $http.get('/members')
          .error(function (data, status) {
            console.log('error fetching members');
            console.log(data);
            console.log(status);
          });
      },

      getOne: function (id) {
        return $http.get('/members/' + id)
          .error(function (data, status) {
            console.log('error fetching members');
            console.log(data);
            console.log(status);
          });
      }
    };

  });
};
