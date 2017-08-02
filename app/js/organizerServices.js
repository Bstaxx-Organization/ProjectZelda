(function () {
    
    'use strict';
    
    var organizer = angular.module('organizer');

    // Sets scope variable to Base64 dataurl
    organizer.service("service", ['data', function ( data ) {
        
        this.propertyValidation = function () {
            var dataModel = data.selectedProperty.dataModel;
            if ( dataModel ) {
                switch ( dataModel ) {
                    case 'item':
                        console.log('test');
                        if( !data.selectedProperty.itemModel ) { return true };
                        break;
                    case 'text':
                        if( !data.selectedProperty.propertyName || !data.selectedProperty.textData ) { return true };
                        break;
                }
            } else {
                return true;
            }
            
            
        }
        
        
        
    }]);
    
}());