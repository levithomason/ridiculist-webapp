'use strict';

angular.module('App')

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/:id', {
                templateUrl: '/app/views/home/home.html',
                controller: 'Controller'
            })
            .when('/', {
                templateUrl: '/app/views/home/home.html',
                controller: 'Controller'
            });
    }])

    .controller('Controller', ['$scope', '$firebaseObject', '$routeParams', '$location', '$rootScope', 'FIREBASE_ROOT',
        function($scope, $firebaseObject, $routeParams, $location, $rootScope, FIREBASE_ROOT) {
        }]);

