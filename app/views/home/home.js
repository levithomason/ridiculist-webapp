'use strict';

angular.module('App.home', [])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'app/views/home/home.html',
            controller: 'HomeCtrl',
        });
    }])

    .controller('HomeCtrl', [
        '$scope', '$firebaseObject', '$routeParams', '$rootScope',
        function($scope, $firebaseObject, $routeParams, $rootScope) {

            var ref = new Firebase('https://blazing-torch-8548.firebaseio.com/lists');

            $scope.newList = function(type) {
                $rootScope.$broadcast('lst:newList:show');
                $rootScope.$broadcast('lst:newList:setType', type);
            };

            $scope.lists = $firebaseObject(ref);
        }]);

