'use strict';

angular.module('App', [
  // ng deps
  'ngRoute',

  // vendor deps
  'firebase',
  'ngClipboard'
])

  .constant('FIREBASE_ROOT', 'https://ridiculist.firebaseio.com/')

  .config(['ngClipProvider', function (ngClipProvider) {
    ngClipProvider.setPath('app/bower/zeroclipboard/dist/ZeroClipboard.swf');
  }])

  .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider.otherwise({redirectTo: '/'});
    $locationProvider.html5Mode(true).hashPrefix('!');
  }]);
