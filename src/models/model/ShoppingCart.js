const mongoose = require('mongoose');
const ShoppingCartSchema = require("../schema/ShoppingCart");
const ShoppingCartModel = mongoose.model('ShoppingCart', ShoppingCartSchema);

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

    async updateShoppingCart(value) {
        await ShoppingCartModel.findOne({
                _id: value._id
            })
            .populate('Items').then(updatedShoppingCart => {
                updatedShoppingCart.totalBill = 0;
                updatedShoppingCart.Items.forEach(element => {
                    updatedShoppingCart.totalBill += element.totalPrice;
                });
                result = updatedShoppingCart.save();
            });

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
    },

    async addCartItem(value) {
        let result = null;

        await ShoppingCartModel.findOne({
            _id: value._id
        }).populate('Items').then(updatedShoppingCart => {
            updatedShoppingCart.Items.push(value.cartItem);
            updatedShoppingCart.totalBill = 0;
            updatedShoppingCart.Items.forEach(element => {
                updatedShoppingCart.totalBill += element.totalPrice;
            });
            result = updatedShoppingCart.save();
        });

        if (result)
            return result;
        else
            return {
                error: "Error with the adding CartItem to ShoppingCarts"
            };
    },

    async removeCartItem(value) {
        let result = null;

        await ShoppingCartModel.findOneAndUpdate({
            _id: value._id
        }, {
            $pull: {
                Items: value.cartItemId
            }
        }, {
            "useFindAndModify": false,
            new: true
        }).populate('Items').then(updatedShoppingCart => {
            updatedShoppingCart.totalBill = 0;
            updatedShoppingCart.Items.forEach(element => {
                // console.log(updatedShoppingCart.totalBill); 
                updatedShoppingCart.totalBill += element.totalPrice;
            });
            // console.log(updatedShoppingCart.totalBill);         
            result = updatedShoppingCart.save();
        });

        if (result)
            return result;
        else
            return {
                error: "Error with the removeing CartItem from ShoppingCarts"
            };
    },

    removeAllCartItem(value) {
        ShoppingCartModel.findOneAndUpdate({
            _id: value.shoppingCartId
        }, {
            $set: {
                'Items': [],
                'totalBill': 0
            }
        }, {
            multi: true,
            "useFindAndModify": false
        });

        if (result)
            return result;
        else
            return {
                error: "Error with the removeing all CartItems from ShoppingCarts"
            };
    }

    // calcTotalBill(updatedShoppingCart) {
    //     updatedShoppingCart.totalBill = 0;
    //     updatedShoppingCart.Items.forEach(element => {
    //         updatedShoppingCart.totalBill += element.totalPrice;
    //     });
    //     updatedShoppingCart.save();
    // }
};