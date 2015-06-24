var ItemListFactory = function($q, ItemFactory, ListFactory, LIST_TYPES, LIST_SECURITY, $firebaseArray) {
  var itemsRef = new Firebase(FIREBASE.items);

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

  ItemList.prototype.save = function() {
    var deferred = $q.defer();
    var self = this;

    // save list then
    self.list.add().then(function(savedList) {
      self.list = savedList;

      angular.forEach(self.items, function(item, i) {
        // skip blank items
        if (!item.name) return;
        item.listId = self.list.$id;
        item.add().then(function(savedItem) {
          // add saved item back to itemList
          self.items[i] = savedItem;
        });
      });

      deferred.resolve(self);
    });

    return deferred.promise;
  };

  //
  // Items
  //
  ItemList.prototype.addItem = function(item) {
    var newItem = new ItemFactory(item);

    this.items.push(newItem);
    return this;
  };

  ItemList.prototype.toggleItem = function(index) {
    var self = this;
    var isSurvey = self.list.type === LIST_TYPES.survey;

    if (!isSurvey) {
      self.items[index].toggle();
    } else {
      // deselect all other items first
      angular.forEach(self.items, function(item, i) {
        if (i !== index) {
          item.setValue(0);
        }
      });

      // select the item
      self.items[index].setValue(1);
    }

    return this;
  };

  return ItemList;
};

angular.module('App.itemList')
  .factory('ItemListFactory', ItemListFactory)
;
