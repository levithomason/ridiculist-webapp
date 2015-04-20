'use strict';

function newList($rootScope) {
    return {
        restrict: 'E',
        replace: true,
        scope: {},
        templateUrl: 'app/components/new-list/new-list.html',
        link: function(scope, elem, attrs) {
            var bodyElm = angular.element(document.body);
            var wrapper = angular.element(document.getElementsByClassName('lst-new-list-wrapper'));
            var backdrop = angular.element(document.getElementsByClassName('lst-new-list-backdrop'));
            var form = angular.element(document.getElementsByClassName('lst-new-list-form'));
            var title = angular.element(document.getElementsByClassName('lst-title-input'));

            scope.init = function() {
                scope.list = {
                    type: 'todo',
                    security: 'public',
                };
                
                scope.items = [];
                scope.addItem();
                scope.show();
            };


            //
            // List
            //

            scope.setType = function(type) {
                scope.list.type = type;
            };

            scope.toggleFeatured = function() {
                var isPublic = scope.list.security === 'public';

                scope.list.security = isPublic ? 'link' : 'public';
            };

            scope.show = function() {
                wrapper.addClass('active');
                title[0].focus();
            };

            scope.hide = function() {
                wrapper.removeClass('active');
            };

            scope.createList = function() {

            };

            //
            // Items
            //

            scope.addItem = function(item) {
                item = item || {};
                item.name = item.name || '';
                item.sort = item.sort || 0;
                item.type = item.type || scope.list.type;
                item.value = item.value || '';

                scope.items.push({
                    name: item.name,
                    sort: item.sort,
                    type: item.type,
                    value: item.value,
                });
            };

            scope.removeItem = function(index) {
                scope.items.splice(index)
            };

            scope.onItemChange = function(item) {
                
            };

            // 
            // Events
            // 

            backdrop.on('click', function() {
                scope.hide();
            });

            bodyElm.on('keydown', function(e) {
                switch (e.keyCode) {
                    // esc
                    case 27:
                        console.log('keycode is 27');
                        scope.hide();
                        break;

                    default:
                        break;
                }
            });

            $rootScope.$on('lst:newList:show', function() {
                scope.show();
            });

            $rootScope.$on('lst:newList:setType', function(event, type) {
                scope.setType(type);
            });

            $rootScope.$on('lst:newList:itemChanged', function(event, item) {
                scope.onItemChange(item);
            });

            //
            // Init
            //

            scope.init();
        }
    }
}

angular.module('App.newList')
    .directive('newList', newList);
