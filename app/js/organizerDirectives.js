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
                    
                    var reader = new FileReader();
                    
                    reader.onload = function (loadEvent) {
                        scope.$apply(function () {
                            scope.fileread = loadEvent.target.result;
                            data.selectedItem.iconUploaded = true;
                        });
                    }
                    
                    reader.readAsDataURL(changeEvent.target.files[0]);
                    
                    data.renderIcons();
                    
                });     
            }
        }
    }]);
    
}());