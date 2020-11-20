const mongoose = require('mongoose');
const ShoppingCartSchema = require("../schema/ShoppingCart");
const ShoppingCartModel= mongoose.model('ShoppingCart', ShoppingCartSchema);

module.exports = {
    createShoppingCart(value) {
        const result = ShoppingCartModel.create(value);

        if (result) {
            return result;
        } else {
            return {
                error: "Error with the creation ShoppingCart"
            };
        }
    },

    updateShoppingCart(value) {
        const result = ShoppingCartModel.findByIdAndUpdate({
            _id: value._id
        }, ShoppingCart);

        if (result) {
            return result;
        } else {
            return {
                error: "Error with the update ShoppingCart"
            };
        }
    },

    deleteShoppingCart(value) {
        const result = ShoppingCartModel.findOneAndDelete({
            _id: value._id
        });

        if (result) {
            return result;
        } else {
            return {
                error: "Error with the delete ShoppingCart"
            };
        }
    },

    getShoppingCart(value) {
        const result = ShoppingCartModel.findById({
            _id: value._id
        });
        if (result)
            return result;
        else
            return {
                error: "Error with the getting ShoppingCart"
            };
    },

    deleteAllShoppingCart() {
        const result = ShoppingCartModel.deleteMany({});

        if (result)
            return result;
        else
            return {
                error: "Error with the delete all ShoppingCarts"
            };
    }
};