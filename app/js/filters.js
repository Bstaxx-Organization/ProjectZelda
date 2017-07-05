// filters.js

(function () {
    
    'use strict';
    
    var organizer = angular.module('categorizer');
    
    organizer.filter('item', function () {
        return function (item) {
           return item;
        }
    });
    
}());