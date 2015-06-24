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

  .controller('Controller', ['$scope', 'FIREBASE', '$firebaseObject', '$routeParams', 'LIST_ICONS',
    function($scope, FIREBASE, $firebaseArray, $routeParams, LIST_ICONS) {
      var publicListsRef = new Firebase(FIREBASE.lists);
      $scope.lists = $firebaseArray(publicListsRef);
      $scope.LIST_ICONS = LIST_ICONS;

      $scope.idUrlParam = $routeParams.id;
    }]);
