'use strict';

angular.module('App.lists', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/:id', {
            templateUrl: 'app/views/lists/lists.html',
            controller: 'ListCtrl'
        });
    }])

    .controller('ListCtrl', [
        '$scope', '$firebaseObject', '$routeParams',
        function ($scope, $firebaseObject, $routeParams) {
            var ref = new Firebase('https://blazing-torch-8548.firebaseio.com/lists/' + $routeParams.id);

            $scope.list = $firebaseObject(ref);

            $scope.increment = function(k, v) {
                $scope.list.List[k]++;
                $scope.list.$save()
            }
        }]);
