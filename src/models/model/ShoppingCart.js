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

    //delete this
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
        let id = null;
        if(value.cartItem._id){
            id = value.cartItem._id;
        } else {
            id = value.cartItem;
        }
        await ShoppingCartModel.findOneAndUpdate({
            _id: value._id
        }, {
            $push: {
                Items: id
            }
        }, {
            "useFindAndModify": false,
            new: true
        }).populate('Items').then(updatedShoppingCart => {
            // updatedShoppingCart.Items.push(value.cartItem);
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
                updatedShoppingCart.totalBill += element.totalPrice;
            });                  
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
        const result = ShoppingCartModel.findOneAndUpdate({
            _id: value._id
        }, {
            $set: {
                'Items': [],
                'totalBill': 0
            }
        }, {
            multi: true,
            "useFindAndModify": false,
            new: true
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