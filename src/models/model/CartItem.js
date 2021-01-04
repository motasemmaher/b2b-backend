const mongoose = require('mongoose');
const CartItemSchema = require("../schema/CartItem");
const CartItemModel= mongoose.model('CartItem', CartItemSchema);

module.exports = {
    createCartItem(value) {
        const result = CartItemModel.create(value);

        if (result) {
            return result;
        } else {
            return {
                error: "Error with the creation CartItem"
            };
        }
    },

    updateCartItem(value) {
        const result = CartItemModel.findByIdAndUpdate({
            _id: value._id
        }, CartItem);

        if (result) {
            return result;
        } else {
            return {
                error: "Error with the update CartItem"
            };
        }
    },

    deleteCartItem(value) {
        const result = CartItemModel.findOneAndDelete({
            _id: value._id
        });

        if (result) {
            return result;
        } else {
            return {
                error: "Error with the delete CartItem"
            };
        }
    },

    getCartItem(value) {
        const result = CartItemModel.findById({
            _id: value._id
        });
        if (result)
            return result;
        else
            return {
                error: "Error with the getting CartItem"
            };
    },

    deleteAllCartItem() {
        const result = CartItemModel.deleteMany({});

        if (result)
            return result;
        else
            return {
                error: "Error with the delete all CartItems"
            };
    }
};