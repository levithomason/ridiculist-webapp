'use strict';

function listItem() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            onChange: '&'
        },
        templateUrl: 'app/components/item-list/item/item.html',
        link: function(scope, elem, attrs) {
            scope.onItemChange = function() {
                scope.onChange();
            }
        }
    }
}

angular.module('App.itemList')
    .directive('listItem', listItem);
