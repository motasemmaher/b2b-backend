const mongoose = require('mongoose');

const Shoppingcart = require('./ShoppingCart');

const schema = mongoose.Schema;

const Order = new schema({
    shoppingcart: {
        type: schema.Types.ObjectId,
        ref: 'ShoppingCart'
    },
    deliveryAddress: {type: String},
    phoneNumber: {
        type: String,
        require: true,
        unique: true,
        minLength: 10,
        maxlength: 10
    },
    date: {type: Date, default: Date.now()},
    status: {type: String}
});

module.exports = Order;
//module.exports = mongoose.model('Order', OrderSchema);