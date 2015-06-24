'use strict';

var FIREBASE = {};

FIREBASE.root = 'https://ridiculist.firebaseio.com/';
FIREBASE.lists = FIREBASE.root + 'lists';
FIREBASE.items = FIREBASE.root + 'items';

var LIST_ICONS = {
    todo: 'ion-android-checkbox-outline',
    vote: 'ion-android-star-outline',
    survey: 'ion-android-radio-button-on'
};

var LIST_TYPES = {
    todo: 'todo',
    vote: 'vote',
    survey: 'survey'
};

angular.module('App.itemList')
    .constant('FIREBASE', FIREBASE)
    .constant('LIST_ICONS', LIST_ICONS)
    .constant('LIST_TYPES', LIST_TYPES)
;
