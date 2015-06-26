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

  .controller('Controller', function($scope, FIREBASE, $firebaseObject, $routeParams, LIST_ICONS, LIST_SECURITY) {
    var publicListsRef = new Firebase(FIREBASE.lists)
      .orderByChild('security')
      .equalTo(LIST_SECURITY.public);
    $scope.lists = $firebaseObject(publicListsRef);
    $scope.LIST_ICONS = LIST_ICONS;

    $scope.idUrlParam = $routeParams.id;
  });
