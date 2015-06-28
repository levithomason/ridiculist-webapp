var Firebase = require('firebase');
var listsRef = new Firebase('https://ridiculist.firebaseio.com/lists');
var itemsRef = new Firebase('https://ridiculist.firebaseio.com/items');

function List(title, type) {
  this.title = title;
  this.type = type || 'todo';
  this.security = 'link';
  console.log('new List:', this);
}

function Item(listId, name, type) {
  this.listId = listId;
  this.name = name;
  this.type = type;
  this.value = 0;
  this.sort = 0;
  console.log('new Item:', this);
}

var slackHelper = {};

slackHelper.parseSlashCommand = function(text) {
  // remove extraneous spaces
  text = text.replace(/  +/g, ' ').trim();

  // Format:
  // Type   Title               Items
  //
  // todo   "outing prep"       here, there, anywhere
  // vote   "where to eat?"     here, there, anywhere
  // survey "best JS framework" here, there, anywhere

  var type = text.split(' ')[0].trim();         // word before first space
  var title = text.split(/"|'/)[1];             // between first quotes
  var items = text.split(/" |' |, /).splice(1); // after title, comma separated

  var parsed = {
    type: type,
    title: title,
    items: items
  };

  console.log('parsed command', parsed);
  return parsed;
};

slackHelper.createList = function(listTitle, listType, itemNames, callback) {
  var newList = new List(listTitle, listType);
  var listRef = listsRef.push(newList);

  // listen once for list to be saved
  listRef.once('value', function(dataSnapshot) {
    var savedList = dataSnapshot.exportVal();
    var listId = listRef.key();

    // save items with listId
    itemNames.forEach(function(itemName) {
      var newItem = new Item(listId, itemName, savedList.type);
      itemsRef.push(newItem);
    });
    
    var linkUrl = "http://www.ridiculi.st/" + listId;
    var linkText = "www.ridiculi.st/" + listId;
    var slackLink = '<' + linkUrl + '|' + linkText + '>';

    callback(null, slackLink);
  }, function(err) {
    callback(err, null);
  });

};

module.exports = slackHelper;
