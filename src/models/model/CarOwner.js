const mongoose = require('mongoose');
const CarOwnerSchema = require("../schema/CarOwner");
const CarOwnerModel= mongoose.model('CarOwner', CarOwnerSchema);

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
    }
    ,
    findAllCarOwners(value) {
        const result = CarOwnerModel.find({}).skip(value.skip).limit(value.limit).populate('user').populate('cars').exec();
        if (result)
            return result;
        else
            return {error: "Error with the getting all CarOwners"};
    }
    ,
    addCarToList(value)
    {
        const result = CarOwnerModel.findByIdAndUpdate(
            { _id: value._id },
            { $push: { cars: value.carInfo } },
            { "useFindAndModify": false }
        );
        if (result)
            return result;
        else
            return { error: "Error with the adding car to cars list" };
    },
    removeCarFromList(value)
    {
        const result = CarOwnerModel.findByIdAndUpdate({ _id: value._id },
            { $pull: { cars: value.carId } },
            { multi: true },
        );
        if (result)
            return result;
        else
            return { error: "Error with the removing car from cars list" };
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
                if (index >= 0) {
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
    },

    async getOrder(value) {
        let result = null;
        await CarOwnerModel.findOne({
            _id: value._id
        }, {
            orders: {
                $elemMatch: {
                    $eq: value.orderId
                }
            }
        })
        .then(cOwner => {
            result = Promise.resolve(cOwner.orders[0]);
        });

        if (result)
            return result;
        else
            return {
                error: "Error in getOrder"
            };
    },

    // getOrders(value) {        
    //     result = CarOwnerModel.findOne({
    //         user: value.user
    //     }, {
    //         orders: 1
    //     }).populate('orders');        

    //     if (result)
    //         return result;
    //     else
    //         return {
    //             error: "Error in getOrders"
    //         };
    // }

};