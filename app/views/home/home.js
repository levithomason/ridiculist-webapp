'use strict';

angular.module('App')

  .config(['$routeProvider', function ($routeProvider) {
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

  .controller('Controller', ['$scope', 'FIREBASE_ROOT', '$firebaseObject', '$routeParams',
    function ($scope, FIREBASE_ROOT, $firebaseObject, $routeParams) {
      var publicListsRef = new Firebase(FIREBASE_ROOT).child('lists');
      $scope.lists = $firebaseObject(publicListsRef);

      $scope.idUrlParam = $routeParams.id;

    }]);

