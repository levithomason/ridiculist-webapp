'use strict';

angular.module('App')

  .config(function($routeProvider) {
    $routeProvider
      .when('/:id', {
        templateUrl: '/app/views/home/home.html',
        controller: 'Controller'
      })
      .when('/', {
        templateUrl: '/app/views/home/home.html',
        controller: 'Controller'
      });
  })

  .controller('Controller', function($scope, FIREBASE, $firebaseObject, $routeParams, LIST_ICONS, $window, $timeout) {
    var publicListsRef = new Firebase(FIREBASE.lists);
    $scope.lists = $firebaseObject(publicListsRef);
    $scope.LIST_ICONS = LIST_ICONS;


    $scope.idUrlParam = $routeParams.id;
  });
