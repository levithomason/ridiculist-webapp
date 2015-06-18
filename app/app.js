'use strict';

angular.module('App', [
    // ng deps
    'ngRoute',

    // vendor deps
    'firebase',
    'ngClipboard'
])

    .constant('FIREBASE_ROOT', 'https://ridiculist.firebaseio.com/')

    .config(['ngClipProvider', function(ngClipProvider) {
        ngClipProvider.setPath('app/bower/zeroclipboard/dist/ZeroClipboard.swf');
    }])

    .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
        $routeProvider.otherwise({redirectTo: '/'});
        $locationProvider.html5Mode(true).hashPrefix('!');
    }])
    .controller('AppController', ['$scope', 'FIREBASE_ROOT', '$firebaseObject',
        function($scope, FIREBASE_ROOT, $firebaseObject) {
            var publicListsRef = new Firebase(FIREBASE_ROOT).child('lists');

            $scope.lists = $firebaseObject(publicListsRef);

            $scope.loadList = function(id) {
                $location.path(id);
            };

        }])
;
