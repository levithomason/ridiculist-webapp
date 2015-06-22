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

    .run(function(ListFactory, ItemFactory, ItemListFactory) {
        // load factories
    })

    .config(['ngClipProvider', function(ngClipProvider) {
        ngClipProvider.setPath('app/bower/zeroclipboard/dist/ZeroClipboard.swf');
    }])

    .config(function(localStorageServiceProvider) {
        localStorageServiceProvider
            .setPrefix('ridiculist')
            .setStorageType('sessionStorage')
            .setNotify(true, true)
    })

    .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
        $routeProvider.otherwise({redirectTo: '/'});
        $locationProvider.html5Mode(true).hashPrefix('!');
    }]);
