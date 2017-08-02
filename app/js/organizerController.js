// navController.js

(function () {
    
    'use strict';
    
    /* INIT | get angular module 'orgainizer'
    ==========================================================*/
    var organizer = angular.module('organizer');

    /* INIT | set module 'orgainizer's controller to 'orgainizerController'
    ==========================================================*/
    organizer.controller('organizerController', function ($scope, data, service) {
        
        
        /*//////////////////////////////////////////////////////////
        ============================================================
        
            SETTINGS AND OPTIONS
        
        ============================================================
        //////////////////////////////////////////////////////////*/
        
        
        /* SETTINGS | attach 'data' and 'service' to '$scope'
        ==========================================================*/
        $scope.data = data;
        $scope.service = service;
        
        /* OPTIONS | navView options
        ==========================================================*/
        $scope.navViewDefault = 'navView.html';
        
        /* SETTINGS | navView settings
        ==========================================================*/
        $scope.navView = $scope.navViewDefault; 
        $scope.breadcrumb = "Hello world"; // breadcrumb text

        /* OPTIONS | contentView options
        ==========================================================*/
        $scope.tableView = 'tableView.html'; 
        $scope.thumbnailView = 'thumbnailView.html'; 
        $scope.listView = "listView.html"; 
        $scope.docView = "docView.html"; 
        $scope.editView = "editView.html";
        
        /* SETTINGS | contentView settings
        ==========================================================*/
        $scope.contentViewContainerClass = "thumbnailView" // controls contentView's Class
        $scope.contentView = $scope.thumbnailView; // controls contentView's view
        
        /* SETTINGS | item settings
        ==========================================================*/
        $scope.itemSettings = {
            rowLimit: 8,
            filter: { active: true },
            orderBy: "title",
            reverseSort: false
        };
        
        /*//////////////////////////////////////////////////////////
        ============================================================
        
            METHODS
        
        ============================================================
        //////////////////////////////////////////////////////////*/
        
        /* METHOD | changeContentView | changes contentView's viewOption
        ==========================================================*/
        $scope.changeContentView = function ( viewOption ) {
            // viewOption isn't already set
            if ($scope.contentView != viewOption) {
                $scope.contentView = viewOption;
                $scope.contentViewContainerClass = '';
                $scope.contentViewContainerClass = $scope.contentView.split('.')[0]; 
            }
        };
        
        /* METHOD | newBtn | switch to editView and/or clear selected item
        ==========================================================*/
        $scope.newBtn = function () {
            if ( $scope.contentView == $scope.editView ) {
                $scope.selectItem();
            } else {
                $scope.changeContentView( $scope.editView );
                console.log( data.selectedItem );
                //var properties = data.selectedItem.properties;
                //properties = properties ? properties : [];
            }
        };
        
        /* METHOD | selectItem | selects an item | clears item is there's no input
        ==========================================================*/
        $scope.selectItem = function ( item ) {
            if ( item ) { 
                $scope.changeContentView( $scope.docView ); 
                data.setItemInputs( item );
            } 
            else { data.setItemInputs(); }
            window.scrollTo(0, 0);              
        }
          
        /* METHOD | canvasClass | returns 'selected' class if data.selectedItem.iconCanvas == elements id
        ==========================================================*/
        $scope.canvasClass = function ( element ) {
            if(data.selectedItem && data.selectedItem.iconCanvas == element.id) {
                return 'selected';
            }
        }

        /* METHOD | sortItems | sorts the items by table column
        ==========================================================*/
        $scope.sortItems = function ( column ) {
            $scope.itemSettings.reverseSort = ($scope.itemSettings.orderBy == column) ? !$scope.itemSettings.reverseSort : false;
            $scope.itemSettings.orderBy = column;
        };
        
        /* METHOD | getSortClass | changes the class of th elements that sort items
        ==========================================================*/
        $scope.getSortClass = function ( column ) {
            if ($scope.itemSettings.orderBy == column) {
                return $scope.itemSettings.reverseSort ? "red" : "green";
            }
            return "";
        };
        
        /* METHOD | isEditMode | returns true if in editView
        ==========================================================*/
        $scope.isEditMode = function () {
            if ( $scope.contentView != $scope.editView ) { return true; } 
            else { return false; }          
        }
        
        // take a look at this method
        /* METHOD | save | adds an item to the $scope.items array
        ==========================================================*/
        $scope.save = function () {
            var canvas = document.querySelector( data.selectedItem.iconCanvas );
            console.log(canvas);
            data.selectedItem.icon = canvas ? canvas.toDataURL("image/png") : "";
            localStorage.setItem("items", JSON.stringify($scope.items));
            console.log( JSON.parse( localStorage.getItem("items")) );
            $scope.setItemInputs();
        }
        
        /* METHOD | saveAndNew | adds an item to the $scope.items array | clears selectedItem
        ==========================================================*/
        $scope.saveAndNew = function () {
            if ( data.selectedItem.title && data.selectedItem.description ) {
                data.selectedItem.active = true;
                
                // assigns id if new item
                if ( !data.selectedItem.id ) {
                     data.selectedItem.id = $scope.items.length;
                }       

                // push selected item into items array if not already there
                if ( $scope.items.indexOf(data.selectedItem) < 0 ) {
                    $scope.items.push( data.selectedItem );
                }    

                //localStorage.items = $scope.items.toString();
                $scope.save();
            } 
            else {
                console.log('You must input both a "title" and "description"');
                console.log( data.selectedItem );
            }
        };
        
        /* METHOD | saveAndClose | saveAndNew and changes contentView
        ==========================================================*/
        $scope.saveAndClose = function () {
            $scope.saveAndNew();
            $scope.changeContentView( $scope.thumbnailView );
        }
        
        /* METHOD | updateItem | updates selected item
        ==========================================================*/
        $scope.updateItem = function () {
            data.selectedItem.title = $scope.newItemTitle;
            data.selectedItem.description = $scope.newItemDesc;
        };

        /* METHOD | getBase64Image 
        ==========================================================*/
        $scope.getBase64Image = function (img) {
            var canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;

            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);

            var dataURL = canvas.toDataURL("image/png");

            return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
        }
        
        /* METHOD | getBase64Image2
        ==========================================================*/
        $scope.getBase64Image2 = function (url) {
            var canvas = document.createElement("canvas"),
                canvas2 = document.querySelector('#myCanvas'),
                image = document.createElement('img'),
                file = document.querySelector('#icon').files[0];
            
            image.src = url;
            canvas.width = 120;
            canvas.height = 120;

            var ctx = canvas2.getContext("2d");
            ctx.drawImage(image, 0, 0);

            var dataURL = canvas.toDataURL("image/png");
            console.log(image);

            //return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
            return dataURL;
        }

        /* METHOD | getBase64Image2
        ==========================================================*/
        $scope.propertyValidation = function ( selectedItem ) {
            var selectedProperty = data.selectedItem.selectedProperty;
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
            };
            
        }
        
        /*//////////////////////////////////////////////////////////
        ============================================================
        
            EXECUTIONS
        
        ============================================================
        //////////////////////////////////////////////////////////*/
        
        if( localStorage && localStorage.items ) {
            var items = JSON.parse( localStorage.getItem("items") );
            data.items = items;
            $scope.items = data.items;
            console.log( items );
            console.log('cookie was set');
        } else {
            data.items = data.sampleData;
            $scope.items = data.items;
            data.save( $scope );
            console.log('cookie was not set');
        }
        
    });  

}());

