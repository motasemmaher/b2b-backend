const mongoose = require('mongoose');

const schema = mongoose.Schema;

const CartItem = new schema({
    product: {
        type: schema.Types.ObjectId,
        ref: 'Product'
    },
    shoppingCart: {
        type: schema.Types.ObjectId,
        ref: 'ShoppingCart'
    },
    storeId: {
        type: schema.Types.ObjectId,
        ref: 'Store'
    },
    quantity: {type: Number},
    date: {type: Date, default: Date.now()},
    totalPrice: {type: Number}
});

module.exports = CartItem;
//module.exports = mongoose.model('CartItem', CartItemSchema);