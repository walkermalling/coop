'use strict';

/**
 *  This file configures the angular application 
 */

require('angular/angular');
require('angular-route');

// App

var coop = angular.module('coop', ['ngRoute']);

// Services

require('./js/services/member-server')(coop);
require('./js/services/transaction-server')(coop);

// Controllers

require('./js/controllers/home-controller')(coop);
require('./js/controllers/transaction-controller')(coop);
require('./js/controllers/member-controller')(coop);
require('./js/controllers/recommendation-controller')(coop);
require('./js/controllers/profile-card-controller')(coop);
require('./js/controllers/recommendation-card-controller')(coop);

// Directives

require('./js/directives/footer-directive')(coop);
require('./js/directives/header-directive')(coop);
require('./js/directives/profile-card-directive')(coop);
require('./js/directives/recommendation-card-directive')(coop);

// Routes

coop.config([ '$routeProvider', '$locationProvider', 
  function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/home-view.html',
        controller: 'recommendationController'
      })
      .when('/activity', {
        templateUrl: 'views/transaction-view.html',
        controller: 'transactionController'
      })
      .when('/members', {
        templateUrl: 'views/member-view.html',
        controller: 'memberController'
      })
      .when('/members/:id', {
        templateUrl: 'views/recommendation-view.html',
        controller: 'recommendationController'
      })
      .otherwise({
        redirectTo: '/'
      });

} ]);