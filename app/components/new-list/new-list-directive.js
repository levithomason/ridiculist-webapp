'use strict';
function newList() {
    return {
        restrict: 'E',
        replace: true,
        scope: {},
        templateUrl: 'app/components/new-list/new-list.html',
        link: function(scope, elem, attrs) {
            var form = angular.element(document.getElementsByClassName('lst-new-list-form'));
            scope.listTypes = ['Poll', 'Checklist'];
            scope.listType = 'Poll';

            scope.createList = function() {
                
            };

            scope.setListType = function(type) {
                scope.listType = type;
            };

            $rootScope.$on('lst-new-list-button-clicked', function() {
                form.toggleClass('lst-show-form');
            });
        }
    }
}

function newListButton() {
    return {
        restrict: 'E',
        replace: true,
        scope: {},
        templateUrl: 'app/components/new-list-button/new-list-button.html',
        link: function(scope, elem, attrs) {
            scope.newClicked = function() {
                $rootScope.$broadcast('lst-new-list-button-clicked');
            };
        }
    }
}

angular.module('App.newList')
    .directive('newList', newList)
    .directive('newListButton', newListButton);
