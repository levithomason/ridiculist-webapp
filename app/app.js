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
    'App.list',
])

    .constant('FIREBASE_ROOT', 'https://ridiculist.firebaseio.com/')
    
    .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
        $routeProvider.otherwise({redirectTo: '/'});
    }]);

