'use strict';

angular.module('App.lists', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/lists/:id', {
            templateUrl: 'lists/lists.html',
            controller: 'ListCtrl'
        });
    }])

    .controller('ListCtrl', [
        '$scope', '$firebaseObject', '$routeParams',
        function ($scope, $firebaseObject, $routeParams) {
            var ref = new Firebase('https://blazing-torch-8548.firebaseio.com/lists/' + $routeParams.id);

            $scope.data = $firebaseObject(ref);

            $scope.increment = function(k, v) {
                $scope.data.List[k]++;
                $scope.data.$save()
            }
        }]);
