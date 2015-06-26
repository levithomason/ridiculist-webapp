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
    // each time an update arrives from the server, apply the change locally
    $$updated: function(snap) {
      // apply the changes using the super method
      var changed = $firebaseObject.prototype.$$updated.apply(this, arguments);

      // todo items share their selected state for all users
      // update selected state
      // we want to update the selected state
      this.updateIsSelected();

      // return whether or not changes occurred
      return changed;
    },
    isType: function(type) {
      return this.type === type;
    },
    updateIsSelected: function() {
      var isTodo = this.isType(LIST_TYPES.todo);
      var isInStorage = localStorageService.get(this.$id);
      this.$isSelected = isTodo ? this.value : isInStorage;
    },
    setSelected: function() {
      // todo items have global state for all users
      // don't store the selected state
      if (this.isType(LIST_TYPES.todo)) return;
      localStorageService.set(this.$id, true);
      this.$isSelected = true;
    },
    removeSelected: function() {
      // todo items have global state for all users
      // don't store the selected state
      if (this.isType(LIST_TYPES.todo)) return;
      localStorageService.remove(this.$id);
      this.$isSelected = false;
    },
    increment: function() {
      var self = this;
      self.value += 1;
      self.setSelected();
      self.$save().catch(function(err) {
        // roll back on failed save
        self.value -= 1;
        self.removeSelected();
        console.error(err);
      });
    },
    decrement: function() {
      var self = this;
      self.value -= 1;
      self.removeSelected();
      self.$save().catch(function(err) {
        // roll back on failed save
        self.value += 1;
        self.setSelected();
        console.error(err);
      });
    },
    toggle: function() {
      this.$isSelected ? this.decrement() : this.increment();
    }
  });

  return function Item(id) {
    return id ? new FirebaseItem(ref.child(id)) : angular.copy(defaultItem);
  };
};

angular.module('App.itemList')
  .factory('ItemFactory', ItemFactory)
;
