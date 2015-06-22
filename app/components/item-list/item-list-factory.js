var ItemListFactory = function($q, ItemFactory, ListFactory) {
    /**
     * An a `list` of `items`.
     * @param {string} [itemList]
     * @param {Item[]} [itemList.items]
     * @param {List} [itemList.list]
     * @constructor
     */
    function ItemList(itemList) {
        // defaults
        this.items = [];
        this.list = new ListFactory();

        angular.extend(this, itemList);
    }
    
    ItemList.getByListId = function(id) {
        var deferred = $q.defer();

        $q.all({
            items: ItemFactory.getByListId(id),
            list: ListFactory.getById(id)
        })
            .then(function(itemList) {
                var newItemList = new ItemList(itemList);
                deferred.resolve(newItemList)
            });

        return deferred.promise;
    };

    ItemList.prototype.getLink = function(type) {
        return this.list.getLink();
    };

    ItemList.prototype.setType = function(type) {
        var newType = LIST_TYPES[type];
        if (!newType) {
            throw new Error('ItemList.setType(type) `type` must be a LIST_TYPE, not: "' + type + '"')
        }

        this.list.type = newType;
        angular.forEach(this.items, function(item) {
            item.type = newType;
        });
    };

    ItemList.prototype.save = function() {
        var deferred = $q.defer();

        var self = this;

        // save list then
        // save non empty items adding listId
        self.list.add().then(function(savedList) {
            angular.forEach(self.items, function(item) {
                if (!item.name) return;
                item.listId = savedList.$id;
                item.add();
            });

            deferred.resolve(self);
        });

        return deferred.promise;
    };

    ItemList.prototype.add = function(item) {
        var newItem = new ItemFactory(item);

        this.items.push(newItem);
        return this;
    };

    ItemList.prototype.remove = function() {
        return this;
    };

    return ItemList;
};

angular.module('App.itemList')
    .factory('ItemListFactory', ItemListFactory)
;
