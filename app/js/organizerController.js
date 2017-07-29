// navController.js

(function () {
    
    'use strict';
    
    var organizer = angular.module('organizer');

    // Sets scope variable to Base64 dataurl
    organizer.directive("fileread", ['data', function (data) {
        return {
            scope: {
                fileread: "="
            },
            link: function (scope, element, attributes) {
                element.bind("change", function (changeEvent) {
                    var reader = new FileReader(),
                        canvas1 = document.querySelector("#iconCanvas1"),
                        canvas2 = document.querySelector("#iconCanvas2"),
                        canvas3 = document.querySelector("#iconCanvas3"),
                        image = document.querySelector("#iconImage"),
                        ctx1 = canvas1 ? canvas1.getContext("2d") : "",
                        ctx2 = canvas2 ? canvas2.getContext("2d") : "",
                        ctx3 = canvas3 ? canvas3.getContext("2d") : "",
                        dataURL = canvas1 ? canvas1.toDataURL("image/png") : "";

                    reader.onload = function (loadEvent) {
                        scope.$apply(function () {
                            scope.fileread = loadEvent.target.result;
                        });
                    }
                    
                    console.log( scope );
                    
                    reader.readAsDataURL(changeEvent.target.files[0])
                    
                    image.onload = function () {
                        var MAX_WIDTH = 120;
                        var MAX_HEIGHT = 120;
                        var width = image.width;
                        var height = image.height;

                        if (width > height) {
                          if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                          }
                        } else {
                          if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                          }
                        }
                        
                        var xOffset = (MAX_WIDTH/2) - (width/2);
                        var yOffset = (MAX_HEIGHT/2) - (height/2);
                        
                        ctx1.beginPath();
                        ctx1.rect(0, 0, MAX_WIDTH, MAX_HEIGHT);
                        ctx1.fillStyle = "white";
                        ctx1.fill();
                        ctx1.drawImage(image, xOffset, yOffset, width, height);
                        
                        ctx2.beginPath();
                        ctx2.rect(0, 0, MAX_WIDTH, MAX_HEIGHT);
                        ctx2.fillStyle = "grey";
                        ctx2.fill();
                        ctx2.drawImage(image, xOffset, yOffset, width, height);
                        
                        ctx3.beginPath();
                        ctx3.rect(0, 0, MAX_WIDTH, MAX_HEIGHT);
                        ctx3.fillStyle = "black";
                        ctx3.fill();
                        ctx3.drawImage(image, xOffset, yOffset, width, height);
                        
                        data.selectedItem.iconCanvas = '#iconCanvas1';
                    }
                    
                    image.src = dataURL;
                });     
            }
        }
    }]);

    organizer.controller('organizerController', function ($scope, storage, data) {
        
        
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
                active: true
            },
            orderBy: "title",
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
                console.log(true);
            } else {
                
                $scope.changeContentView( $scope.editView );
                console.log(false);
                var properties = data.selectedItem.properties;
                properties = properties ? properties : [];
            }
            
        };
        
        
        $scope.canvasClass = function (id) {
            if(data.selectedItem.iconCanvas == id) {
                return 'selected';
            }
        }
        
        $scope.data = data;
        
        
        
        $scope.selectItem = function ( item ) {
            if ( item ) { 
                $scope.changeContentView( $scope.docView ); 
                $scope.setItemInputs( item );
            } else {
                $scope.setItemInputs();
            }
            window.scrollTo(0, 0);
            //console.log( item );               
        }
        
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
        

        /* sets or clears item inputs
        ==========================================================*/
        $scope.setItemInputs = function ( item ) {
            if (item) {
                data.selectedItem = item;
            } else {
                data.selectedItem = data.newItem();
                var canvas1 = document.querySelector("#iconCanvas1"),
                    canvas2 = document.querySelector("#iconCanvas2"),
                    canvas3 = document.querySelector("#iconCanvas3"),
                    ctx1 = canvas1 ? canvas1.getContext("2d") : false,
                    ctx2 = canvas2 ? canvas2.getContext("2d") : false,
                    ctx3 = canvas3 ? canvas3.getContext("2d") : false;
                if(ctx1 && ctx2 && ctx3) {
                    ctx1.clearRect(0, 0, canvas1.width, canvas1.height);
                    ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
                    ctx3.clearRect(0, 0, canvas3.width, canvas3.height);
                }
                
            }
        };
        
        $scope.isEditMode = function () {
            if ( $scope.contentView != $scope.editView && data.selectedItem.title ) {
                return true;
            } else {
                return false;
            }          
        }
        
        $scope.isItemProperty = function ( item ) {
            /*if ( item && item.id ) {
                for( var i = 0; i < data.selectedItem.items.length; i++ ) {
                   if( data.selectedItem.items[i] == item.id ) {
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
        $scope.save = function () {
            var canvas = document.querySelector( data.selectedItem.iconCanvas );
            console.log(canvas);
            data.selectedItem.icon = canvas ? canvas.toDataURL("image/png") : "";
            localStorage.setItem("items", JSON.stringify($scope.items));
            console.log( JSON.parse( localStorage.getItem("items")) );
            $scope.setItemInputs();
        }
        
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
        
        $scope.saveAndClose = function () {
            $scope.saveAndNew();
            $scope.changeContentView( $scope.thumbnailView );
        }
        
        /* adds property to the data.selectedItem.items array
        ==========================================================*/
        $scope.addProperty = Item.prototype.addProperty;
        
        /* updates selected item
        ==========================================================*/
        $scope.updateItem = function () {
            data.selectedItem.title = $scope.newItemTitle;
            data.selectedItem.description = $scope.newItemDesc;
        };
        
        $scope.delete = function ( item ) {
            console.log('delete');
            if( confirm("Are you sure you want to delete this item?") ) {
                item.active = false;
                console.log(item);
            }
            data.save( $scope );
            console.log(item);
        }
        
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
        
        $scope.getBase64Image = function (img) {
            var canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;

            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);

            var dataURL = canvas.toDataURL("image/png");

            return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
        }
        
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
        
        
        /* returns an items by it's ID
        ==========================================================*/
        $scope.getItemById = function ( id ) {
            var item = {};
            return item;
        }
        
        $scope.newItem = function ( data ) {
            var newItem = Object.create(Item),
                proto = newItem.prototype;
            if(!newItem.properties) { newItem.properties = []; }
            for ( var key in data ) { newItem[key] = data[key]; }
            //for ( var key in proto ) { newItem[key] = proto[key]; }
            //console.log(newItem);
            return newItem;
        }
        
        // selected item default settings
        data.selectedItem = data.newItem({
            propertyAction: "inherit",
            newPropertyType: "text",
            created: new Date(),
            createdBy: "Brandon Anthony",
            active: false,
        }); 
        
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
                //return false;
            };
            
        }
        
        if( localStorage && localStorage.items ) {
            var items = JSON.parse( localStorage.getItem("items") );
            $scope.items = items;
            console.log( items );
            console.log('cookie was set');
        } else {
            $scope.items = data.sampleData;
            data.save( $scope );
            console.log('cookie was not set');
        }
        
        console.log($('.thumbLabel'));
        
        //$scope.data();

       
    });  

}());

