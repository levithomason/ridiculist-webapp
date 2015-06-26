var ItemListFactory = function($q, ItemFactory, ListFactory, LIST_TYPES, LIST_SECURITY, $firebaseArray) {
  var itemsRef = new Firebase(FIREBASE.items);
  var listsRef = new Firebase(FIREBASE.lists);
  var items = $firebaseArray(itemsRef);
  var lists = $firebaseArray(listsRef);

  /**
   * An a `list` of `items`.
   * @param {string} [itemList]
   * @param {ItemFactory[]} [itemList.items]
   * @param {ListFactory} [itemList.list]
   * @constructor
   */
  function ItemList(itemList) {
    itemList = itemList || {};

    // defaults
    this.items = [];
    this.list = new ListFactory();
    this.isValid = false;

    angular.extend(this, itemList);
  }

  ItemList.getByListId = function(id) {
    var itemQuery = itemsRef.orderByChild('listId').equalTo(id);
    var itemList = new ItemList();
    itemList.list = new ListFactory(id);

    $firebaseArray(itemQuery).$loaded().then(function(remoteItems) {
      angular.forEach(remoteItems, function(item) {
        itemList.items.push(new ItemFactory(item.$id));
      });
    });

    return itemList;
  };

  ItemList.prototype.getLink = function() {
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

  ItemList.prototype.validate = function() {
    var hasTitle = !!this.list.title.trim();
    var hasItems = this.items.filter(function(item) {
      return !!item.name.trim()
    }).length;

    this.isValid = hasTitle && hasItems;
  };

  ItemList.prototype.create = function() {
    var deferred = $q.defer();
    var self = this;

    if (!self.isValid) {
      deferred.reject('ItemList is not valid, cannot create()');
    } else {
      // save list then add items with listId
      lists.$add(self.list).then(function(savedList) {
        var listId = savedList.key();
        // add saved list back to itemList
        self.list = new ListFactory(listId);

        angular.forEach(self.items, function(item, i) {
          // skip blank items
          if (!item.name) return;

          // record listId on item
          item.listId = self.list.$id;
          items.$add(item).then(function(savedItem) {
            // add saved item back to itemList
            self.items[i] = savedItem;
          });
        });

        deferred.resolve(self);
      });
    }

    return deferred.promise;
  };

  //
  // Items
  //
  ItemList.prototype.addItem = function() {
    var newItem = new ItemFactory();
    newItem.type = this.list.type;
    this.items.push(newItem);
  };

  ItemList.prototype.toggleItem = function(index) {
    var item = this.items[index];
    // don't toggle items on unsaved lists
    if (!this.list.$id) return;

    // if survey item was clicked
    // deselect the current item
    if (item.isType(LIST_TYPES.survey)) {
      var currentItem = this.items.filter(function(itm) {
        return itm.$isSelected;
      })[0];

      if (currentItem) currentItem.toggle();
    }

    // select the new item
    item.toggle();
  };

  return ItemList;
};

angular.module('App.itemList')
  .factory('ItemListFactory', ItemListFactory)
;
