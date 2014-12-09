'use strict';

/**
 *  This file configures the angular application 
 */

require('angular/angular');
require('angular-route');

// App

var coop = angular.module('coop', ['ngRoute']);

// Services

// Controllers

require('./js/controllers/home-controller')(coop);
require('./js/controllers/transaction-controller')(coop);
require('./js/controllers/member-controller')(coop);
require('./js/controllers/recommendation-controller')(coop);


// Directives

require('./js/directives/footer-directive')(coop);
require('./js/directives/header-directive')(coop);

// Routes

coop.config([ '$routeProvider', '$locationProvider', 
  function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/home-view.html',
        controller: 'homeController'
      })
      .when('/transactions', {
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