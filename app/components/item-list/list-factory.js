var ListFactory = function(FIREBASE, $firebaseObject, LIST_TYPES, LIST_SECURITY) {
  var ref = new Firebase(FIREBASE.lists);

  var defaultList = {
    title: '',
    security: LIST_SECURITY.public,
    type: LIST_TYPES.todo,
    $toggleSecurity: function() {
      console.log(this);
      var isPublic = this.$hasSecurity(LIST_SECURITY.public);
      this.security = isPublic ? LIST_SECURITY.link : LIST_SECURITY.public;
    },
    $hasSecurity: function(type) {
      return this.security === type;
    }
  };

  var FirebaseList = $firebaseObject.$extend({
    $$defaults: defaultList,
    getLink: function() {
      return this.$id ? 'www.ridiculi.st/' + this.$id : null;
    }
  });

  function List(id) {
    return id ? new FirebaseList(ref.child(id)) : angular.copy(defaultList);
  }

  return List;
};

angular.module('App.itemList')
  .factory('ListFactory', ListFactory)
;
