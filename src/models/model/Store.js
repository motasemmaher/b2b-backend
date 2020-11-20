const mongoose = require('mongoose');
const StoreSchema = require("../schema/Store");
const StoreModel= mongoose.model('Store', StoreSchema);

module.exports = {
    createStore(value) {
        const result = StoreModel.create(value);

        if (result) {
            return result;
        } else {
            return {
                error: "Error with the creation Store"
            };
        }
    },

    updateStore(value) {
        const result = StoreModel.findOneAndUpdate({
            _id: value._id
        }, value, { "useFindAndModify": false });

        if (result) {
            return result;
        } else {
            return {
                error: "Error with the update Store"
            };
        }
    },

    deleteStore(value) {
        const result = StoreModel.findOneAndDelete({
            _id: value._id
        });

        if (result) {
            return result;
        } else {
            return {
                error: "Error with the delete Store"
            };
        }
    },

    getStore(value) {
        const result = StoreModel.findById({
            _id: value._id
        });
        if (result)
            return result;
        else
            return {
                error: "Error with the getting Store"
            };
    },

    async updateOrderStatus(value) {
        let result = null;
       await StoreModel.findOne(
            {_id: value._id},
            {
                orders: {$elemMatch: { $eq: value.orderId }}
            }
        ).populate('orders').then(store => { 
            store.orders[0].status = value.status;
            result = store.orders[0].save();
        });
        
        if (result)
            return result;
        else
            return {
                error: "Error with the getting Store"
            };
    },
    
    addOrder(value) {
        const result = StoreModel.findOneAndUpdate(
            { _id: value._id },
            { $push: { orders: value.orderId } },
            { "useFindAndModify": false }
        );

        if (result)
        return result;
    else
        return {
            error: "Error with the adding order to the Store"
        };
        
    },

    deleteAllStore() {
        const result = StoreModel.deleteMany({});

        if (result)
            return result;
        else
            return {
                error: "Error with the delete all Stores"
            };
    },

    getStoresAssociatedWithGarageOwner(value) {
        const result = StoreModel.find({
            garageOwnerId: value.garageOwnerId
        });

        if (result)
            return result;
        else
            return {
                error: "Error in getStoresAssociatedWithGarageOwner"
            };
    },

    getOrderFromeStore(value) {
        const result = StoreModel.findOne(
            {_id: value._id},
            {
                orders: {$elemMatch: { $eq: value.orderId }}
            }
        );

        if (result)
            return result;
        else
            return {
                error: "Error in getOrderFromeStore"
            };
    }
};