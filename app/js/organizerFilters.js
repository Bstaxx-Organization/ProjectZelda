// filters.js

(function () {
    
    'use strict';
    
    var organizer = angular.module('organizer');
    
    organizer.filter('item', function () {
        return function (itemId, scope, property) {
           for( var i = 0; i < scope.items.length; i++ ) {
               if( scope.items[i].id == itemId && property) {
                   return scope.items[i][property];
               } else if( scope.items[i].id == itemId) {
                   return scope.items[i];
               }
           }
        }
    });
    
    organizer.filter('getPropertyName', function () {
        return function (property, scope) {
            var output = [],
                items = scope.items;
            switch( property.model ) {
                case 'item' :
                    for( var i = 0; i < items.length; i++ ) {
                        if( items[i].id == property.itemId ) {
                            return items[i].title;
                        }
                    };
                    break;
                default :
                    return property.propertyName;
            } 
        }
    });
    
    // filters items array for items that are not already in selectedItem properties 
    organizer.filter('freeProperties', ['data', function (data) {
        return function (items, scope) {
            var output = [],
                properties = data.selectedItem.properties;
            for ( var i= 0; i < items.length; i++ ) {
                var isProperty = false;
                if ( properties ) {
                    for ( var j = 0; j < properties.length; j++ ) {        
                        if ( properties[j].itemId && items[i].id == properties[j].itemId ) { 
                            isProperty = true; 
                        } 
                    }
                }
                if ( items[i].id == data.selectedItem.id ) { isProperty = true; }
                if ( !isProperty ) { output.push( items[i] ); } 
            }
            return output;
        }
    }]);
    
    organizer.filter('isItemClass', ['data', function (data) {
        return function ( items, scope, item ) {
            data.selectedItem.classes = [];
            
            // loop through items
            for( var i = 0; i < items.length; i++ ) {
                
                if( items[i].properties.length > 1 ) {
                     
                    // loop through item properties
                    for( var j = 0; j < items[i].properties.length; j++ ) {
                        
                        if ( data.selectedItem.id == items[i].properties[j].itemId )
                            console.log( data.selectedItem.id + " == " + items[i].properties[j].itemId );
                            //console.log( data.selectedItem.id );

                        
                            data.selectedItem.classes.push( items[i] )
                            
                        

                        //var text = items[i].properties[k].itemId + " == " + items[j].id;
                        //console.log(text);

                    }
                            
                        
                        
                        /*if ( items[i].properties[j].id == items[i].id) {
                            console.log(items[i].properties[j].id + " == " + items[i].id)
                            data.selectedItem.classes.push( items[i] );
                        }*/
                    
                }  
            }
            console.log(data.selectedItem.classes);
            return data.selectedItem.classes;
        }
    }]);
    
    organizer.filter('prototype', function () {
        return function ( items, scope ) {
            var output = [];
            for( var i = 0; i < items.length; i++ ) {
                
                output.push( scope.newItem( items[i] ) );
                
            }
            //
            return output;
        }
    });
    
}());