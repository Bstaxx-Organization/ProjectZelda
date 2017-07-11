// navController.js

(function () {
    
    'use strict';
    
    var organizer = angular.module('categorizer');
    
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
    organizer.filter('freeProperties', function () {
        return function (items, scope) {
            var output = [],
                properties = scope.selectedItem.properties;
            for ( var i= 0; i < items.length; i++ ) {
                var isProperty = false;
                if ( properties ) {
                    for ( var j = 0; j < properties.length; j++ ) {        
                        if ( properties[j].itemId && items[i].id == properties[j].itemId ) { 
                            isProperty = true; 
                        } 
                    }
                }
                if ( items[i].id == scope.selectedItem.id ) { isProperty = true; }
                if ( !isProperty ) { output.push( items[i] ); } 
            }
            return output;
        }
    });
    
    organizer.filter('isItemClass', function () {
        return function ( items, scope ) {
            scope.selectedItem.classes = [];
            for( var i = 0; i < items.length; i++ ) {
                
                    for( var j = 0; j < items[i].properties.length; j++ ) {
                        if ( items[i].properties[j].id == scope.selectedItem.id) {
                            scope.selectedItem.classes.push( items[i] );
                        }
                    }
                
            }
            //
            return scope.selectedItem.classes;
        }
    });
    
    organizer.controller('navController', function ($scope, storage) {
        
        
        /* navView's settings
        ==========================================================*/
        $scope.navView = "navView.html"; // viewOption
        $scope.breadcrumb = "Hello world"; // breadcrumb text

        /* contentView's settings
        ==========================================================*/
        $scope.contentViewContainerClass = "thumbnailView" // controls contentView's Class
        $scope.tableView = 'tableView.html'; // view selection
        $scope.thumbnailView = 'thumbnailView.html'; // view selection
        $scope.listView = "listView.html"; // view selection
        $scope.docView = "docView.html"; // view selection
        $scope.editView = "editView.html"; // view selection
        $scope.contentView = $scope.thumbnailView; // controls contentView's view
        
        // item list settings
        $scope.itemSettings = {
            rowLimit: 8,
            filter: {
                active: true,
                title: "",
                description: ""
            },
            orderBy: "name",
            reverseSort: false
        };
        
        /* changes contentView's viewOption
        ==========================================================*/
        $scope.changeContentView = function ( viewOption ) {
            // viewOption isn't already set
            if ($scope.contentView != viewOption) {
                $scope.contentView = viewOption;
                $scope.contentViewContainerClass = '';
                $scope.contentViewContainerClass = $scope.contentView.split('.')[0]; 
            }
        };
        
        /* Local Storage
        ==========================================================*/
        $scope.saveData = function () {
            //storage.items = $scope.items;
        }
        
        
        
        /* 
        ==========================================================*/
        $scope.newBtn = function () {
            if ( $scope.contentView == $scope.editView ) {
                $scope.selectItem();
            } else {
                
                $scope.changeContentView( $scope.editView );
                
                var properties = $scope.selectedItem.properties;
                properties = properties ? properties : [];
            }
            
        };
        
        /* sorts the items by column
        ==========================================================*/
        $scope.sortItems = function ( column ) {
            $scope.itemSettings.reverseSort = ($scope.itemSettings.orderBy == column) ? !$scope.itemSettings.reverseSort : false;
            $scope.itemSettings.orderBy = column;
        };
        
        /* changes the class of th elements that sort items
        ==========================================================*/
        $scope.getSortClass = function ( column ) {
            if ($scope.itemSettings.orderBy == column) {
                return $scope.itemSettings.reverseSort ? "red" : "green";
            }
            return "";
        };
        
        /* selects an item or clears docView's inputs
        ==========================================================*/
        $scope.selectItem = function ( item ) {
            if ( item ) { 
                $scope.changeContentView( $scope.docView ); 
                $scope.setItemInputs( item );
            } else {
                $scope.setItemInputs();
            }
            window.scrollTo(0, 0);
            console.log( item );               
        }

        /* sets or clears item inputs
        ==========================================================*/
        $scope.setItemInputs = function ( item ) {
            if (item) {
                $scope.selectedItem = item;
            } else {
                $scope.selectedItem = $scope.newItem();
            }
        };
        
        $scope.isEditMode = function () {
            if ( $scope.contentView != $scope.editView && $scope.selectedItem.title ) {
                return true;
            } else {
                return false;
            }          
        }
        
        $scope.isItemProperty = function ( item ) {
            /*if ( item && item.id ) {
                for( var i = 0; i < $scope.selectedItem.items.length; i++ ) {
                   if( $scope.selectedItem.items[i] == item.id ) {
                       console.log(item.title);
                       return true;
                   }               
                }
            }*/
            console.log( item );
            
            return false;
        }
        
        /* adds an item to the $scope.items array
        ==========================================================*/
        $scope.saveAndNew = function () {
            if ( $scope.selectedItem.title && $scope.selectedItem.description ) {
                $scope.selectedItem.active = true;
                
                // assigns id if new item
                if ( !$scope.selectedItem.id ) {
                     $scope.selectedItem.id = $scope.items.length;
                }       

                // push selected item into items array if not already there
                if ( $scope.items.indexOf($scope.selectedItem) < 0 ) {
                    $scope.items.push( $scope.selectedItem );
                }    

                $scope.setItemInputs();
            } 
            else {
                console.log('You must input both a "title" and "description"');
                console.log( $scope.selectedItem );
            }
        };
        
        $scope.saveAndClose = function () {
            $scope.saveAndNew();
            $scope.changeContentView( $scope.thumbnailView );
        }
        
        /* adds property to the $scope.selectedItem.items array
        ==========================================================*/
        $scope.addProperty = function ( item, propertyId ) {
            item.items
        };
        
        /* updates selected item
        ==========================================================*/
        $scope.updateItem = function () {
            $scope.selectedItem.title = $scope.newItemTitle;
            $scope.selectedItem.description = $scope.newItemDesc;
        };
        
        $scope.deleteProperty = function ( property ) {
            if( confirm("Are you sure you want to delete this item property?") ) {
                property.active = false;
                console.log(property);
            }
        };
        
        $scope.test = function ( message ) {
            console.log(message);
        };
        
        /* returns an items parent title
        ==========================================================*/
        $scope.getParentName = function (item) {
            if (item.parent) {
                for (var i = 0; i < $scope.items.length; i++) {
                    if ( $scope.items[i].id == item.parent ) {
                        return $scope.items[i].title;
                    }
                };
            }
        };
        
        
        /* returns an items by it's ID
        ==========================================================*/
        $scope.getItemById = function ( id ) {
            var item = {};
            return item;
        }
        
        $scope.newItem = function ( args ) {
            var item = Item.prototype,
                newItem = args ? args : {};
            newItem.prototype = item;
            newItem.properties = newItem.properties ? newItem.properties : [];
            newItem.delete = item.delete;
            newItem.restore = item.restore;
            newItem.deleteProperty = item.deleteProperty;
            newItem.addProperty = item.addProperty;
            newItem.inheritProperties = item.inheritProperties;
            return newItem;
        }
        
        // selected item default settings
        $scope.selectedItem = $scope.newItem({
            propertyAction: "inherit",
            newPropertyType: "text",
            created: new Date(),
            createdBy: "Brandon Anthony",
            active: false,
        }); 
        
        $scope.propertyValidation = function ( selectedItem ) {
            var selectedProperty = selectedItem.selectedProperty;
            console.log( selectedProperty );
            if ( selectedProperty ) {
                switch( selectedProperty.dataModel ) {
                    case 'item':
                        if( typeof selectedProperty.itemModel == 'number' ) { return true; };
                        break;
                    default:
                        var input = selectedProperty.dataModel + 'Data';
                        if( selectedProperty.propertyName && selectedProperty[input] ) { return true; };
                        break;
                };
                //return false;
            };
            
        }
        
        /* Storage
        ==========================================================*/
        storage.bind($scope, 'items', { defaultValue: [
            
            $scope.newItem({
                id: 0,
                created: new Date("August 16, 2016"),
                createdBy: "Brandon Anthony",
                active: true,
                title: 'Fruit', 
                description: 'The sweet and fleshy product of a tree or other plant that contains seed and can be eaten as food.',
                icon: "img/fruit.png",
                items: [1,2,3],
                properties: [
                    { model: 'item', itemId: 1, active: true },
                    { model: 'item', itemId: 2, active: true },
                    { model: 'item', itemId: 3, active: true }
                ],
                propertyAction: "inherit"
            }),
            
            $scope.newItem({
                id: 1,
                created: new Date("August 16, 2016"),
                createdBy: "Brandon Anthony",
                active: true,
                title: 'Apple', 
                description: 'the round fruit of a tree of the rose family, which typically has thin red or green skin and crisp flesh. Many varieties have been developed as dessert or cooking fruit or for making cider.', 
                icon: "img/apple.png",
                items: [],
                properties: [],
                propertyAction: "inherit"
            }),
            
            $scope.newItem({
                id: 2,
                created: new Date("August 16, 2016"),
                createdBy: "Brandon Anthony",
                active: true,
                cloneOf: 2,
                title: 'Gala Apple', 
                description: '\'Gala\' is a clonally propagated apple cultivar with a mild and sweet flavor. \'Gala\' apples ranked at number 2 in 2006 on the US Apple Association\'s list of most popular apples, after \'Red Delicious\' and before \'Golden Delicious\', \'Granny Smith\', and \'Fuji\' (in order).[2] The skin color of the fruit is non-uniform.', 
                icon: "img/galaApple.png",
                items: [],
                properties: [],
                propertyAction: "inherit"
            }),
            
            $scope.newItem({
                id: 3,
                created: new Date("August 16, 2016"),
                createdBy: "Brandon Anthony",
                active: true,
                cloneOf: 2,
                title: 'Golden Delicious Apple', 
                description: 'The Golden Delicious is a cultivar of apple with a yellow color, not closely related to the Red Delicious apple.[1] According to the US Apple Association website it is one of the 15 most popular apple cultivars in the United States.[2]', 
                icon: "img/goldenD.png",
                items: [],
                properties: [],
                propertyAction: "inherit"
            }),
            
            $scope.newItem({
                id: 4,
                created: new Date("August 16, 2016"),
                createdBy: "Brandon Anthony",
                active: true,
                cloneOf: 2,
                title: 'Foods', 
                description: 'any nutritious substance that people or animals eat or drink, or that plants absorb, in order to maintain life and growth', 
                icon: "",
                items: [0],
                properties: [
                    { model: 'item', itemId: 0, active: true }
                ],
                propertyAction: "inherit"
            }),
            
        ] });
        
        storage.viewType = 'ANYTHING';
        console.log(storage.get('items'));
       
    });  

}());

