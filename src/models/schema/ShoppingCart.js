const mongoose = require('mongoose');

const CartItem = require('./CartItem');

const schema = mongoose.Schema;

const ShoppingCart = new schema({
    Items: [{
        type: schema.Types.ObjectId,
        ref: 'CartItem'
    }],
    totalBill: {type: Number, default: 0}
});


module.exports = ShoppingCart;
