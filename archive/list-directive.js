'use strict';

function list($rootScope, $timeout, $q, $location, $routeParams, $firebaseArray, $firebaseObject, FIREBASE_ROOT, LIST_TYPES) {
    return {
        restrict: 'E',
        replace: true,
        scope: {},
        templateUrl: 'app/components/list/list.html',
        link: function(scope, elem, attrs) {
            var listsRef = new Firebase(FIREBASE_ROOT).child('lists');
            var itemsRef = new Firebase(FIREBASE_ROOT).child('items');
            var lists = $firebaseArray(listsRef);
            var items = $firebaseArray(itemsRef);

            var bodyElm = angular.element(document.body);
            var wrapper = angular.element(document.getElementsByClassName('lst-list-wrapper'));
            var backdrop = angular.element(document.getElementsByClassName('lst-list-backdrop'));
            var form = angular.element(document.getElementsByClassName('lst-list-form'));
            var title = angular.element(document.getElementsByClassName('lst-title-input'));

            scope.init = function() {
                scope.LIST_TYPES = LIST_TYPES;
                scope.listId = $routeParams.id;
                scope.isNew = !scope.listId;
                scope.listLink = scope.listId ? 'ridiculi.st/' + scope.listId : null;

                scope.listId ? scope.loadList($routeParams.id) : scope.newList();
            };

            //
            // List
            //

            scope.newList = function() {
                scope.list = {type: LIST_TYPES.todo, security: 'public'};
                scope.items = [];
                scope.addItem();
            };

            scope.loadList = function(id) {
                var listRef = new Firebase(FIREBASE_ROOT).child('lists').orderByKey().equalTo(id);
                var itemQuery = new Firebase(FIREBASE_ROOT).child('items').orderByChild('listId').equalTo(id);

                $firebaseArray(listRef).$loaded().then(function(response) {
                    scope.list = response.$getRecord(id);
                });

                $firebaseArray(itemQuery).$loaded().then(function(response) {
                    scope.items = response;
                    console.log(response);
                });
            };

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
                item.value = item.value || 0;

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

            scope.incrementItem = function(item) {
                console.log(item);
                var itemRef = new Firebase(FIREBASE_ROOT).child('items').orderByKey().equalTo(id);
                var item = $firebaseObject(itemRef);
                item.value += 1;
                //item.$save().then(function(item) {
                //    console.log('saved:', item);
                //}, function(error) {
                //    console.error('error:', error);
                //});
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

            scope.onItemClick = function(item) {
                // don't do anything when clicking on items in a new list
                if (scope.isNew) {
                    return;
                }

                switch (item.type) {
                    case LIST_TYPES.todo:
                        //item.value = !item.value;
                        break;
                    case LIST_TYPES.vote:
                        scope.incrementItem(item.$id);
                        break;
                    case LIST_TYPES.survey:
                        break;
                }
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

            $rootScope.$on('lst:list:submit', function() {
                scope.createList();
            });

            $rootScope.$on('lst:list:setType', function(event, type) {
                scope.setType(type);
            });

            $rootScope.$on('lst:list:item:changed', function(event, item) {
                scope.onItemChange(item);
            });

            $rootScope.$on('lst:list:item:clicked', function(event, item) {
                scope.onItemClick(item);
            });

            $rootScope.$on('lst:list:item:setFocus', function(event, itemIndex) {
                scope.focusItem(itemIndex);
            });

            //
            // Init
            //

            scope.init();
        }
    }
}

angular.module('App.itemList')
    .directive('list', list);
