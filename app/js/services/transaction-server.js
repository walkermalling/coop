'use strict';

module.exports = function (app) {
  app.factory('transactionServer', function ($http) {
  
    return {
      collection: function () {
        return $http.get('/transactions')
          .error(function (data, status) {
            console.log('error fetching transactions');
            console.log(data);
            console.log(status);
          });
      }
    };

  });
};
