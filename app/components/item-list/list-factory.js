var ListFactory = function(FIREBASE, $firebaseObject, LIST_TYPES) {
  var ref = new Firebase(FIREBASE.lists);

  var defaultList = {
    title: '',
    security: LIST_SECURITY.public,
    type: LIST_TYPES.todo
  };

  var FirebaseList = $firebaseObject.$extend({
    $$defaults: defaultList,
    getLink: function() {
      return this.$id ? 'www.ridiculi.st/' + this.$id : null;
    },
    isType: function(type) {
      return this.type === type;
    },
    hasSecurity: function(type) {
      return this.security === type;
    }
  });

  function List(id) {
    return id ? new FirebaseList(ref.child(id)) : angular.copy(defaultList);
  }

  List.toggleSecurity = function(list) {
    var isPublic = list.hasSecurity(LIST_SECURITY.public);
    list.security = isPublic ? LIST_SECURITY.link : LIST_SECURITY.public;
  };

  return List;
};

angular.module('App.itemList')
  .factory('ListFactory', ListFactory)
;
