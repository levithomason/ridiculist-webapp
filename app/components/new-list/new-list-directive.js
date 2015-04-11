'use strict';
function newList() {
    return {
        restrict: 'E',
        replace: true,
        scope: {},
        templateUrl: 'app/components/new-list/new-list.html',
        link: function(scope, elem, attrs) {
            
        }
    }
}
angular.module('App.newList')
    .directive('newList', newList);
