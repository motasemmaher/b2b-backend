const mongoose = require('mongoose');
const CarOwnerSchema = require("../schema/CarOwner");
const CarOwnerModel = mongoose.model('CarOwner', CarOwnerSchema);

module.exports = {
    createCarOwner(value) {
        const result = CarOwnerModel.create(value);

        if (result) {
            return result;
        } else {
            return {
                error: "Error with the creation CarOwner"
            };
        }
    },

    updateCarOwner(value) {
        const result = CarOwnerModel.findOneAndUpdate({
            _id: value._id
        }, value, {
            "useFindAndModify": false
        });

        if (result) {
            return result;
        } else {
            return {
                error: "Error with the update CarOwner"
            };
        }
    },

    deleteCarOwner(value) {
        const result = CarOwnerModel.findOneAndDelete({
            _id: value._id
        });

        if (result) {
            return result;
        } else {
            return {
                error: "Error with the delete CarOwner"
            };
        }
    },

    getCarOwner(value) {
        const result = CarOwnerModel.findById({
            _id: value._id
        });
        if (result)
            return result;
        else
            return {
                error: "Error with the getting CarOwner"
            };
    },

    getCarOwnerByUserId(value) {
        const result = CarOwnerModel.findOne({
            user: value.user
        });
        if (result)
            return result;
        else
            return {
                error: "Error with the getting CarOwner"
            };
    },

    deleteAllCarOwner() {
        const result = CarOwnerModel.deleteMany({});

        if (result)
            return result;
        else
            return {
                error: "Error with the delete all CarOwners"
            };
    },

    async addOrder(value) {
        let result = null;
        await this.getCarOwnerByUserId({
            user: value.user
        }).populate('shoppingCart').then((owner) => {
            owner.orders.push(value.createdOrder);
            // if(owner.shoppingCart.Items.length > 0) {
            // owner.shoppingCart.Items = [];
            // owner.shoppingCart.totalBill = 0;
            // await owner.shoppingCart.save().then(savedItems => {
            result = owner.save();
            // });
            // }

        });
        
        if (result)
        return result;
    else
        return {
            error: "Error in addOrder"
        };
    },

    async clearShoppingcart(value) {
        let result = null;
        await this.getCarOwner({
            _id: value.user
        }).populate('shoppingCart').then((owner) => {
            if (owner.shoppingCart.Items.length > 0) {
                owner.shoppingCart.Items = [];
                owner.shoppingCart.totalBill = 0;
                result = owner.shoppingCart.save();
            }

        });
        
        if (result)
        return result;
    else
        return {
            error: "Error in clearShoppingcart"
        };
    },

    async removeOrder(value) {
        let result = null;
        await CarOwnerModel.findOne({
                    _id: value._id
                },
                // {orders: {$elemMatch: { $eq: value.orderId}}}
            )
            // .populate('stores')
            .then(cOwner => {
                let index = cOwner.orders.indexOf(value.orderId);
                if(index >= 0 ) {
                // console.log();
                //     // console.log(cOwner.stores[0].orders.splice(index, 1));
                cOwner.orders.splice(index, 1);
                result = cOwner.save();
                }
                //     result = Promise.resolve(cOwner);
            });

            if (result)
            return result;
        else
            return {
                error: "Error in removeOrder"
            };
    }
};