'use strict';

/**
 *  This file configures the angular application 
 */

require('angular/angular');
require('angular-route');

// App

var coop = angular.module('coop', ['ngRoute']);

// Services

// Models

// Controllers

require('./js/controllers/home-controller')(coop);

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
      .otherwise({
        redirectTo: '/'
      });

} ]);