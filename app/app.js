'use strict';

angular.module('App', [
    // ng deps
    'ngRoute',

    // vendor deps
    'firebase',

    // components
    'App.newList',
    
    // views
    'App.home',
    'App.lists',
])
    .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
        $routeProvider.otherwise({redirectTo: '/'});
    }]);

