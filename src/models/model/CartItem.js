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
        const result = CartItemModel.findOneAndUpdate({
            _id: value._id
        }, {
            $set: {
                productId: value.productId,
                quantity: value.quantity,
                date: value.date,
                totalPrice: value.totalPrice
            }
        }, {
            "useFindAndModify": false
        });

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

    deleteAllCartItemsAssociatedWithShoppingCartId(value) {
        const result = CartItemModel.deleteMany({
            shoppingCart: value.shoppingCartId
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

    getCartItemsAssociatedWithShoppingCartId(value) {
        const result = CartItemModel.find({
            shoppingCart: value.shoppingCartId
        }).limit(value.limit).skip(value.skip);
        if (result)
            return result;
        else
            return {
                error: "Error with the getting CartItem"
            };
    },

    getCartItemAssociatedWithShoppingCartId(value) {
        console.log(value);
        const result = CartItemModel.findOne({
            $and: [{
                    _id: value._id
                },
                {
                    shoppingCart: value.shoppingCartId
                }
            ]
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