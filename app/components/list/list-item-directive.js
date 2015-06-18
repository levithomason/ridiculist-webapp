'use strict';

function listItem($rootScope) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            disable: '=',
            name: '=',
            sort: '=',
            type: '=',
            value: '=',
            index: '='
        },
        templateUrl: 'app/components/list/list-item.html',
        link: function(scope, elem, attrs) {
            scope.toggle = function() {
                scope.value = !scope.value;
            };

            scope.onChange = function() {
                $rootScope.$broadcast('lst:list:itemChanged', scope);
            };
            
            scope.onKeydown = function(e) {
                switch (e.keyCode) {
                    // enter
                    case 13:
                        var offset = e.shiftKey ? -1 : 1;
                        $rootScope.$broadcast('lst:list:focusItemIndex', scope.index + offset);
                        break;
                    
                    default:
                        break;
                }
            }
        }
    }
}

angular.module('App')
    .directive('listItem', listItem);
