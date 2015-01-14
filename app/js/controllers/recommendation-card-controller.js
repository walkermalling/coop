'use strict';

var _ = require('lodash');

module.exports = function (app) {

  app.controller('recommendationCardController', 
    ['$scope', '$routeParams', 'memberServer', '$q',
    function ($scope, $routeParams, memberServer, $q) {

      // scope is isolate

      $scope.user = {};
      $scope.extras = {'show' : false};

      /**
       *  Execute
       */

      if ($routeParams.id) {

        // prepare a promise for the user request
        
        var deferredUser = $q.defer();
        var promiseUser = deferredUser.promise;

        // request the user

        memberServer.getOne($routeParams.id)
          .success(function (data) {
            $scope.user = data.member;
            $scope.user.trxs = data.receiverTransactions;
            // resolve the promise
            deferredUser.resolve($scope.user);
        });

        /**
         * when the the user has loaded, look into the record and select the
         * most highly recommmended provider
         * then send another request for that provider
         */
        
        promiseUser.then(function (user) {

          var recs = user.stats.recommendations;
          var sortable = [];
          
          // prepare an array of this member's recommendations
          
          for (var key in recs) {
            sortable.push({'id':key,'rating': recs[key]});
          }

          // sort the recommendations by rating

          var sorted = _.sortBy(sortable, 'rating');

          // send a request for the highest recommended provider

          memberServer.getOne(sorted[sorted.length - 1].id)
            .success(function (data) {
              $scope.user.recommendedProvider = data.member;
            });
        });
      }

    }
  ]);
};