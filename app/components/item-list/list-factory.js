var ListFactory = function(FIREBASE, $firebaseObject, LIST_TYPES) {
  var ref = new Firebase(FIREBASE.lists);

  var defaultList = {
    title: '',
    security: LIST_SECURITY.public,
    type: LIST_TYPES.todo,
    toggleSecurity: function() {
      var isPublic = this.security === 'public';
      this.security = isPublic ? 'link' : 'public';
    }
  };

  var FirebaseList = $firebaseObject.$extend({
    $$defaults: defaultList,
    getLink: function() {
      return this.$id ? 'www.ridiculi.st/' + this.$id : null;
    }
  });


  return function List(id) {
    return id ? new FirebaseList(ref.child(id)) : defaultList;
  };
};

angular.module('App.itemList')
  .factory('ListFactory', ListFactory)
;

///////////////////////////////////////////////////////////////////////////////
//List.prototype.add = function() {
//  return lists.$add(this)
//    .then(function(ref) {
//      var savedRecord = lists.$getRecord(ref.key());
//      return new List(savedRecord);
//    });
//};
