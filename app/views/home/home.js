'use strict';

angular.module('App.home', [])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'app/views/home/home.html',
            controller: 'HomeCtrl',
        });
    }])

    .controller('HomeCtrl', [
        '$scope', '$firebaseObject', '$routeParams',
        function($scope, $firebaseObject) {
            var ref = new Firebase('https://blazing-torch-8548.firebaseio.com/lists');

            $scope.lists = $firebaseObject(ref);
        }]);

