const mongoose = require('mongoose');

const User = require('./User');
const Car = require('./Car');
const Order = require('./Order');
const ShoppingCart = require('./ShoppingCart');


const schema = mongoose.Schema;

const CarOwner = new schema({
    user: {
        type: schema.Types.ObjectId,
        ref: 'User'
    },
    shoppingCart: {
        type: schema.Types.ObjectId,
        ref: 'ShoppingCart'
    },
    orders: [{
        type: schema.Types.ObjectId,
        ref: 'Order'
    }],
    cars: [{
        type: schema.Types.ObjectId,
        ref: 'Car'
    }]
});

module.exports = CarOwner;
//module.exports = mongoose.model('CarOwner', CarOwnerSchema);