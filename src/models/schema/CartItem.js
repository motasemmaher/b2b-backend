const mongoose = require('mongoose');

const schema = mongoose.Schema;

const CartItem = new schema({
    product: {type: String},
    quantity: {type: Number},
    date: {type: Date,default: Date.now()},
    totalPrice: {type: Number}
});

module.exports = CartItem;
//module.exports = mongoose.model('CartItem', CartItemSchema);