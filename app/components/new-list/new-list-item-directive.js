'use strict';

function newListItem($rootScope) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            name: '=',
            sort: '=',
            type: '=',
            value: '=',
            index: '='
        },
        templateUrl: 'app/components/new-list/new-list-item.html',
        link: function(scope, elem, attrs) {
            scope.toggle = function() {
                scope.value = !scope.value;
            };

            scope.onChange = function() {
                $rootScope.$broadcast('lst:newList:itemChanged', scope);
            };
            
            scope.onKeydown = function(e) {
                switch (e.keyCode) {
                    // enter
                    case 13:
                        var offset = e.shiftKey ? -1 : 1;
                        $rootScope.$broadcast('lst:newList:focusItemIndex', scope.index + offset);
                        break;
                    
                    default:
                        break;
                }
            }
        }
    }
}

angular.module('App.newList')
    .directive('newListItem', newListItem);
