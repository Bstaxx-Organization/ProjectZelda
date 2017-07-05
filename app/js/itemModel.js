var Item = {};

Item.prototype = {
    
    delete: function () {
        if( confirm("Are you sure you want to delete this item?") ) {
            this.active = false;
            console.log(this);
            return this;
        }
        
    },
    
    restore: function () {
        this.active = true;
        return this;
    },
    
    inheritProperties: function ( items ) {
        console.log(items);
        var inheritance = this.inheritance,
            properties = [];
        for ( var i = 0; i < this.inheritance.length; i++ ) {
            var property = inheritance[i];
            console.log(property);
            for ( var j = 0; j < items.length; j++ ) {
                //if ( property.ownerId == items[j].id ) {
                    properties.push(items[j].properties[i])
               // }
            }
            
        }
        
        console.log(properties);
    },
    
    getIcon: function ( item ) {
        if ( this.icon ) {
            return this.icon;
        } else {
            return "img/img-mock-up.png";
        }
        //console.log(this);
    },
    
    deleteProperty: function ( property ) {
        if( confirm("Are you sure you want to delete this property?")) {
            var properties = this.properties,
                index = properties.indexOf( property );
            if (index > -1) {
                properties.splice(index, 1);
            }
        }
    },
    
    addProperty: function () {
        var selectedProperty = this.selectedProperty;
        switch( selectedProperty.dataModel ) {
            case 'item':
                this.properties.push({ 
                    id: this.properties.length,
                    model: selectedProperty.dataModel, 
                    itemId: selectedProperty.itemModel, 
                    active: true 
                });
                console.log(selectedProperty);
                break;
            case 'text':
                this.properties.push({ 
                    id: this.properties.length,
                    model: selectedProperty.dataModel, 
                    propertyName: selectedProperty.propertyName, 
                    data: selectedProperty.textData,
                    active: true 
                });
                console.log(selectedProperty);
                break;
        }
        
        this.selectedProperty = {};
    }
};