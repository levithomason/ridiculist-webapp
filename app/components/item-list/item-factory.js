var ItemFactory = function(FIREBASE, LIST_TYPES, $firebaseObject, localStorageService) {
  var ref = new Firebase(FIREBASE.items);

  var defaultItem = {
    listId: '',
    name: '',
    sort: 0,
    type: LIST_TYPES.todo,
    value: 0,
    // this is a per user property
    // angular will scrub $ props before it is posted to firebase
    $isSelected: false
  };

  var FirebaseItem = $firebaseObject.$extend({
    $$defaults: defaultItem,
    setSelection: function() {
      var self = this;
      localStorageService.set(self.$id, true);
      self.updateIsSelected();
    },
    removeSelection: function() {
      var self = this;
      localStorageService.remove(self.$id);
      self.updateIsSelected();
    },
    updateIsSelected: function() {
      var self = this;
      var isTodo = self.type === LIST_TYPES.todo;
      var isStored = localStorageService.get(self.$id);
      self.$isSelected = isTodo ? self.value : isStored;
    },
    setValue: function(val) {
      var self = this;
      self.value = val;
      self.$save();
      return this;
    },
    increment: function() {
      var self = this;
      self.value += 1;
      self.$save();
      return this;
    },
    decrement: function() {
      var self = this;
      self.value -= 1;
      self.$save();
      return this;
    },
    toggle: function() {
      switch (this.type) {
        case LIST_TYPES.todo:
          this.toggleBoolean();
          break;
        case LIST_TYPES.vote:
          this.toggleSum();
          break;
        case LIST_TYPES.survey:
          this.toggleSum();
          break;
      }
      return this;
    },
    toggleBoolean: function() {
      this.$isSelected === 0 ? this.setValue(1) : this.setValue(0);
      return this;
    }
    ,
    toggleSum: function() {
      this.$isSelected ? this.decrement() : this.increment();
      return this;
    }
  });

  return function Item(id) {
    return id ? new FirebaseItem(ref.child(id)) : angular.copy(defaultItem);
  };
};

angular.module('App.itemList')
  .factory('ItemFactory', ItemFactory)
;

///////////////////////////////////////////////////////////////////////////////

//Item.prototype.add = function() {
//  var deferred = $q.defer();
//  var itemObj;
//  var self = this;
//
//  if (!self.listId) {
//    throw new Error('Item.save() requires a `listId` property to save.')
//  }
//
//  items.$add(self)
//    .then(function(ref) {
//      var itemId = ref.key();
//      var itemRef = new Firebase(FIREBASE.items).child(itemId);
//      itemObj = $firebaseObject(itemRef);
//
//      return itemObj.$loaded()
//    })
//
//    .then(function(itemObj) {
//      console.log('itemObj', itemObj);
//      var newItem = new Item(itemObj);
//      console.log('newItem', newItem);
//      deferred.resolve(newItem);
//
//      // To make the data available in the DOM, assign it to $scope
//      //$scope.data = obj;
//
//      // For three-way data bindings, bind it to the scope instead
//      //obj.$bindTo($scope, "data");
//    });
//
//  return deferred.promise;
//};
