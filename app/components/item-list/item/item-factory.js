var ItemFactory = function($q, FIREBASE, $firebaseArray, LIST_TYPES) {
    var ref = new Firebase(FIREBASE.items);
    var items = $firebaseArray(ref);

    /**
     * A list item.
     * @param {object} item
     * @param {string} item.listId
     * @param {string} item.name
     * @param {number} item.sort
     * @param {string} item.type
     * @param {number} item.value
     * @constructor
     */
    function Item(item) {
        item = item || {};

        this.listId = item.listId || '';
        this.name = item.name || '';
        this.sort = item.sort || 0;
        this.type = item.type || LIST_TYPES.todo;
        this.value = item.value || 0;
    }

    Item.getByListId = function(id) {
        var deferred = $q.defer();
        var items = [];
        var query = ref.orderByChild('listId').equalTo(id);

        $firebaseArray(query).$loaded()
            .then(function(remoteItems) {
                angular.forEach(remoteItems, function(item) {
                    items.push(new Item(item));
                });

                deferred.resolve(items);
            });

        return deferred.promise;
    };

    Item.prototype.add = function() {
        if (!this.listId) {
            throw new Error('Item.save() requires a `listId` property to save.')
        }

        return items.$add(this)
            .then(function(ref) {
                var savedRecord = items.$getRecord(ref.key());
                return new Item(savedRecord);
            });
    };

    Item.prototype.increment = function() {
        this.value += 1;
        return this;
    };

    Item.prototype.decrement = function() {
        this.value -= 1;
        return this;
    };

    Item.prototype.setValue = function(val) {
        this.value = val;
        return this;
    };

    window.Item = Item;

    return Item;
};

angular.module('App.itemList')
    .factory('ItemFactory', ItemFactory)
;
