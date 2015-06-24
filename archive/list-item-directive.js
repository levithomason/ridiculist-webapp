'use strict';

function listItem($rootScope, LIST_ICONS) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            isReadOnly: '=',
            name: '=',
            sort: '=',
            type: '=',
            value: '=',
            index: '='
        },
        templateUrl: 'app/components/list/list-item.html',
        link: function(scope, elem, attrs) {
            scope.LIST_ICONS = LIST_ICONS;
            scope.item = {
                $id: scope.id,
                name: scope.name,
                sort: scope.sort,
                type: scope.type,
                value: scope.value,
                index: scope.index,
            };

            scope.toggle = function() {
                scope.value = scope.value ? 0 : 1;
            };

            scope.onChange = function() {
                $rootScope.$broadcast('lst:list:item:changed', scope.item);
            };

            scope.onClick = function() {
                console.log('i got clicked:', scope.item);
                $rootScope.$broadcast('lst:list:item:clicked', scope.item);
            };

            scope.handleEnterKey = function(e) {
                var offset;

                if (e.metaKey) {
                    $rootScope.$broadcast('lst:list:submit');
                } else {
                    offset = e.shiftKey ? -1 : 1;
                    $rootScope.$broadcast('lst:list:item:setFocus', scope.index + offset);
                }
            };

            scope.onKeydown = function(e) {
                switch (e.keyCode) {
                    // enter
                    case 13:
                        scope.handleEnterKey(e);
                        break;

                    default:
                        break;
                }
            }
        }
    }
}

angular.module('App.itemList')
    .directive('listItem', listItem);
