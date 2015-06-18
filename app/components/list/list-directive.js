'use strict';

function list($rootScope, $timeout, $q, $location, $routeParams, $firebaseArray, FIREBASE_ROOT) {
    return {
        restrict: 'E',
        replace: true,
        scope: {},
        templateUrl: 'app/components/list/list.html',
        link: function(scope, elem, attrs) {
            var listsRef = new Firebase(FIREBASE_ROOT + 'lists/');
            var lists = $firebaseArray(listsRef);
            var itemsRef = new Firebase(FIREBASE_ROOT + 'items/');
            var items = $firebaseArray(itemsRef);

            var bodyElm = angular.element(document.body);
            var wrapper = angular.element(document.getElementsByClassName('lst-list-wrapper'));
            var backdrop = angular.element(document.getElementsByClassName('lst-list-backdrop'));
            var form = angular.element(document.getElementsByClassName('lst-list-form'));
            var title = angular.element(document.getElementsByClassName('lst-title-input'));

            scope.init = function() {
                scope.listId = $routeParams.id;
                scope.listLink = scope.listId ? 'ridiculi.st/' + scope.listId : null;

                // load list /:id or init new empty list
                if (scope.listId) {
                    // Load List
                    var listRef = new Firebase(FIREBASE_ROOT).child('lists').orderByKey().equalTo(scope.listId);

                    $firebaseArray(listRef).$loaded().then(function(response) {
                        scope.list = response.$getRecord(scope.listId);
                    });

                    // Load Items
                    var listItemsRef = new Firebase(FIREBASE_ROOT)
                        .child('items')
                        .orderByChild('listId')
                        .equalTo(scope.listId);

                    $firebaseArray(listItemsRef).$loaded().then(function(response) {
                        scope.items = response;
                        console.log(response);
                    });
                } else {
                    scope.list = {type: 'todo', security: 'public'};
                    scope.items = [];
                    scope.addItem();
                }

                scope.show();
            };


            //
            // List
            //

            scope.setType = function(type) {
                scope.list.type = type;
            };

            scope.getLink = function() {
                return scope.listLink;
            };

            scope.onCopy = function() {
                scope.linkCopied = true;

                $timeout(function() {
                    scope.linkCopied = false;
                }, 1000);
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
                lists.$add(scope.list)
                    .then(function(newList) {
                        var listId = newList.key();

                        var itemPromises = [];
                        angular.forEach(scope.items, function(item, i, arr) {
                            // don't add empty items
                            if (!item.name) return;

                            // add listId to item, save
                            item.listId = listId;
                            var promise = items.$add(item);
                            itemPromises.push(promise);
                        });

                        return $q.all(itemPromises)
                            .finally(function() {
                                $location.path(listId);
                            })
                    })
                    .catch(function(error) {
                        console.error(error);
                    });
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

                scope.items.push(item);
            };

            scope.removeItem = function(index) {
                scope.items.splice(index)
            };

            scope.focusItem = function(index) {
                var focusInput = document.getElementsByClassName('lst-list-item-input')[index];
                if (focusInput) {
                    focusInput.focus();
                }
            };

            scope.onItemChange = function(itemScope) {

                $timeout(function() {
                    var totalBlank = 0;

                    scope.items.forEach(function(item, i, arr) {
                        var isBlank = item.name.trim().length === 0;
                        var isLast = i === arr.length - 1;

                        totalBlank += isBlank ? 1 : 0;

                        if (isBlank && !isLast) {
                            scope.focusItem(i + 1);
                            arr.splice(i, 1);
                        }

                    });

                    if (totalBlank === 0) {
                        scope.addItem();
                    }
                }, 0);
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

            $rootScope.$on('lst:list:show', function() {
                scope.show();
            });

            $rootScope.$on('lst:list:setType', function(event, type) {
                scope.setType(type);
            });

            $rootScope.$on('lst:list:itemChanged', function(event, item) {
                scope.onItemChange(item);
            });

            $rootScope.$on('lst:list:focusItemIndex', function(event, itemIndex) {
                scope.focusItem(itemIndex);
            });

            //
            // Init
            //

            scope.init();
        }
    }
}

angular.module('App')
    .directive('list', list);
