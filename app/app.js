'use strict';

angular.module('App', [
    // ng deps
    'ngRoute',

    // vendor deps
    'firebase',

    // app
    'App.lists',
])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'HomeCtrl',
            controller: 'HomeCtrl',
        });
        $routeProvider.otherwise({redirectTo: '/'});
    }])

    .controller('HomeCtrl', [
        '$scope', '$firebaseObject', '$routeParams',
        function($scope, $firebaseObject, $routeParams) {
            var ref = new Firebase('https://blazing-torch-8548.firebaseio.com/lists/' + $routeParams.id);

            $scope.data = $firebaseObject(ref);

            $scope.increment = function(k, v) {
                $scope.data.List[k]++;
                $scope.data.$save()
            }
        }]);

