'use strict';

function newListItem() {
    return {
        restrict: 'E',
        replace: true,
        require: '^newList',
        scope: {
            name: '=',
            sort: '=',
            type: '=',
            value: '=',
            index: '='
        },
        templateUrl: 'app/components/new-list/new-list-item.html',
        link: function(scope, elem, attrs, newListCtrl) {
            scope.item = {
                name: scope.name,
                sort: scope.sort,
                type: scope.type,
                value: scope.value
            }
        }
    }
}

angular.module('App.newList')
    .directive('newListItem', newListItem);
