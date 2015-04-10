'use strict';

angular.module('App', [
    // ng deps
    'ngRoute',

    // vendor deps
    'firebase',

    // app
    'App.view1',
])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.otherwise({redirectTo: '/view1'});
    }])

    .controller('Controller', function ($scope, $firebaseObject) {
        var ref = new Firebase('https://blazing-torch-8548.firebaseio.com');

        $scope.data = $firebaseObject(ref);

        console.log($scope.data);
    });
