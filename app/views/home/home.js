'use strict';

angular.module('App.home', [])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'app/views/home/home.html',
            controller: 'HomeCtrl',
        });
    }])

    .controller('HomeCtrl', [
        '$scope', '$firebaseObject', '$routeParams', '$rootScope', 'FIREBASE_ROOT',
        function($scope, $firebaseObject, $routeParams, $rootScope, FIREBASE_ROOT) {
            var listRef;
            var publicListsRef = new Firebase(FIREBASE_ROOT + 'lists');

            // a particular list
            if ($routeParams.id) {
                listRef = new Firebase(FIREBASE_ROOT + 'lists/' + $routeParams.id);

                $scope.list = $firebaseObject(listRef);
            }

            $scope.lists = $firebaseObject(publicListsRef);

            $scope.newList = function(type) {
                $rootScope.$broadcast('lst:newList:show');
                $rootScope.$broadcast('lst:newList:setType', type);
            };

        }]);
