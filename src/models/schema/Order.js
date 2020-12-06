const mongoose = require('mongoose');

const Shoppingcart = require('./ShoppingCart');

const schema = mongoose.Schema;

const Order = new schema({
    shoppingCart: {
        type: schema.Types.ObjectId,
        ref: 'ShoppingCart'
    },
    deliveryAddress: {type: String},
    phoneNumber: {
        type: String,
        require: true,
        minLength: 10,
        maxlength: 10
    },
    carOwnerId: {
        type: schema.Types.ObjectId,
        ref: 'CarOwner'
    },
    date: {type: Date, default: Date.now()},
    status: {
        type: String,
        enum: ["pending", "cancel", "delivered"]
    }
});

module.exports = Order;
//module.exports = mongoose.model('Order', OrderSchema);