const mongoose = require('mongoose');

const GarageOwner = require('./GarageOwner');
const Menu = require('./Menu');
const Warehouse = require('./Warehouse');

const schema = mongoose.Schema;

const Store = new schema({

    userId: {
        type: String,
        required: true
    },

    storeIdCopy: {
        type: String,
    },

    name: {
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
        maxlength: 8
    },

    image: {type: String},

    description: {
        type: String,
        required: true,
        trim: true,
        minLength: 8,
        maxlength: 512 
    },

    openTime: {
        type: String,
        required: true,
        trim: true,
        minLength: 7,
        maxlength: 8
    },

    closeTime: {
        type: String,
        required: true,
        trim: true,
        minLength: 7,
        maxlength: 8
    },

    location: {
        type:String,
        //required:true
    },
    /*location: {
        long: {type:String,required: true,trim: true},
        lat: {type:String,required: true,trim: strue},
    },
    */
    //menu: Menu,
    menu: {
        type: schema.Types.ObjectId,
        ref: 'Menu'
    },

    warehouse: {
        type: schema.Types.ObjectId,
        ref: 'Warehouse'
    },
    tags : [{type:String,required:true}],

    orders: [{
        type: schema.Types.ObjectId,
        ref: 'Order'
    }],

    garageOwnerId: {
        type: schema.Types.ObjectId,
        ref: 'GarageOwner'
    },

});

module.exports = Store;
//module.exports = mongoose.model('Store', StoreSchema);
