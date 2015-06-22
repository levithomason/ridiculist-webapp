var ListFactory = function($q, FIREBASE, $firebaseArray) {
    var ref = new Firebase(FIREBASE.lists);
    var lists = $firebaseArray(ref);

    /**
     * A list.
     * @param {object} [list]
     * @param {string} [list.name]
     * @param {string} [list.security]
     * @param {string} [list.type]
     * @constructor
     */
    function List(list) {
        list = list || {};

        // defaults
        this.title = '';
        this.security = 'public';
        this.type = 'todo';
        
        angular.extend(this, list);
    }

    // Static
    List.getById = function(id) {
        var deferred = $q.defer();

        lists.$loaded().then(function() {
            var list = lists.$getRecord(id);
            var newList = new List(list);
            deferred.resolve(newList);
        });

        return deferred.promise;
    };

    // Prototype
    List.prototype.save = function() {
        return lists.save(this);
    };
    List.prototype.focusItem = function() {
        return this;
    };

    window.List = List;

    return List;
};

angular.module('App.itemList')
    .factory('ListFactory', ListFactory)
;
