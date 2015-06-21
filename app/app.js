'use strict';

angular.module('App', [
    // ng deps
    'ngRoute',

    // vendor deps
    'firebase',
    'ngClipboard',
    'LocalStorageModule',
    
    // app deps
    'App.list',
])

    .constant('FIREBASE_ROOT', 'https://ridiculist.firebaseio.com/')

    .config(['ngClipProvider', function (ngClipProvider) {
        ngClipProvider.setPath('app/bower/zeroclipboard/dist/ZeroClipboard.swf');
    }])

    .config(function (localStorageServiceProvider) {
        localStorageServiceProvider
            .setPrefix('ridiculist')
            .setStorageType('sessionStorage')
            .setNotify(true, true)
    })

    .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
        $routeProvider.otherwise({redirectTo: '/'});
        $locationProvider.html5Mode(true).hashPrefix('!');
    }]);
