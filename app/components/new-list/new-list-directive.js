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
            
            scope.listType = 'todo';

            scope.createList = function() {
                
            };

            scope.setListType = function(type) {
                scope.listType = type;
            };
            
            scope.show = function() {
                wrapper.addClass('active');
                title[0].focus();
            };

            scope.hide = function() {
                wrapper.removeClass('active');
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
                scope.setListType(type);
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
