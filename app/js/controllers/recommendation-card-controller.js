'use strict';

var _ = require('lodash');

module.exports = function(app){

  app.controller('recommendationCardController', 
    ['$scope', '$routeParams', 'memberServer', '$q',
    function($scope, $routeParams, memberServer, $q) {

      // scope is isolate

      $scope.user = {};

      /**
       *  Execute
       */

      if ( $routeParams.id ) {

        var deferredUser = $q.defer();
        var promiseUser = deferredUser.promise;

        memberServer.getOne($routeParams.id)
          .success(function (data) {
            $scope.user = data.member;
            $scope.user.trxs = data.receiverTransactions;
            deferredUser.resolve($scope.user);
        });

        promiseUser.then(function (user) {

          var recs = user.stats.recommendations;
          var sortable = [];
          
          for (var key in recs) {
            sortable.push({'id':key,'rating': recs[key]});
          }

          var sorted = _.sortBy(sortable, 'rating');

          memberServer.getOne(sorted[sorted.length-1].id)
            .success(function (data) {
              $scope.user.recommendedProvider = data.member;
            });
        });
      }

    }
  ]);
};