'use strict';

angular.module('App', [
  // ng deps
  'ngRoute',

  // vendor deps
  'firebase',
  'ngClipboard',
  'LocalStorageModule',

  // app deps
  'App.itemList',
])

  .config(function(ngClipProvider) {
    ngClipProvider.setPath('/bower_components/zeroclipboard/dist/ZeroClipboard.swf');
  })

  .config(function(localStorageServiceProvider) {
    localStorageServiceProvider
      .setPrefix('ridiculist')
      .setStorageType('sessionStorage')
      .setNotify(true, true)
  })

  .config(function($routeProvider, $locationProvider) {
    $routeProvider.otherwise({redirectTo: '/'});
    $locationProvider.html5Mode(true).hashPrefix('!');
  });
