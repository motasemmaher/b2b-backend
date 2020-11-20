const mongoose = require('mongoose')
const CartItemSchema = require("../schema/CartItem");

const CartItemModel= mongoose.model('CartItem', CartItemSchema);

module.exports = {
    insert: function (newCartItem) {  
        CartItemModel.create(newCartItem).then(result => console.log("Inserted new CartItem"))
        .catch(err => console.log("Error with the creation: " + err));
    },

    update: function (CartItem) {  
        CartItemModel.findByIdAndUpdate({_id: CartItem._id}, CartItem).then(result => console.log("CartItem updated"))
        .catch(err => console.log("Error with the update"));
    },

    delete: function (CartItem) {  
        CartItemModel.findOneAndDelete({_id: CartItem._id}).then(result => console.log("CartItem deleted"))
        .catch(err => console.log("Error with the deleted"));
    }
};