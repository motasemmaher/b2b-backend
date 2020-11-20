const mongoose = require('mongoose');

const schema = mongoose.Schema;

const Store = new schema({

    storeName: {
        type: String,
        required: true,
        trim: true,
        minLength: 8,
        maxlength: 64
    },

    address: {
        type: String,
        required: true,
        trim: true,
        minLength: 4,
        maxlength: 64
    },

    image: {type: String},

    description: {
        type: String,
        required: true,
        trim: true,
        minLength: 8,
        maxlength: 1000 
    },

    opentime: {
        type: String,
        required: true,
        trim: true,
        minLength: 8,
        maxlength: 64
    },

    closetime: {
        type: String,
        required: true,
        trim: true,
        minLength: 8,
        maxlength: 64
    },

    location: {type: String,required: true,trim: true},

    //menu: Menu,
    menu: {
        type: schema.Types.ObjectId,
        ref: 'Menu'
    },

    warehouse: {
        type: schema.Types.ObjectId,
        ref: 'Warehouse'
    },

    orders: [{
        type: schema.Types.ObjectId,
        ref: 'Order'
    }],

    garageOwnerId: {
        type: schema.Types.ObjectId,
        ref: 'GarageOwner'
    }

});

module.exports = Store;
//module.exports = mongoose.model('Store', StoreSchema);
