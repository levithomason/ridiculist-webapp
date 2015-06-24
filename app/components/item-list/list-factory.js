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
    }
  });

  function List(id) {
    return id ? new FirebaseList(ref.child(id)) : angular.copy(defaultList);
  }

  List.toggleSecurity = function(list) {
    var isPublic = list.security === 'public';
    list.security = isPublic ? 'link' : 'public';
  };

  return List;
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
