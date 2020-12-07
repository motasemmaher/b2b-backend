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

    makeCopy(value)
    {
        const result = StoreModel.findByIdAndUpdate({_id: value._id},{storeIdCopy:value.storeIdCopy},{"useFindAndModify":false});

        if (result) {
            return result;
        } else {
            return {
                error: "Error with the update Store copy"
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
        }).then().catch();

        if (result) {
            return result;
        } else {
            return {
                error: "Error with the delete Store"
            };
        }
    },

    findStores(value)
    {
        const result = StoreModel.find({userId:value.userId},{_id:1});
        if (result) 
            return result;
        else 
            return {error: "Error with the delete Stores by userId"};
    },

    findAllStores()
    {
        const result = StoreModel.find({}).select('storeName , address , image');
        if (result) 
            return result;
        else 
            return {error: "Error with the finding all Stores"};
    },

    deleteStoreByUserId(value)
    {
        const result = StoreModel.deleteMany({userId: value.userId});

        if (result) 
            return result;
        else 
            return {error: "Error with the delete Stores by userId"};
    
    },

    findStoreById(value) {
        const result = StoreModel.findById({_id: value.storeId});
        if (result)
            return result;
        else
            return {error: "Error with the getting Store"};
    },

    getStoreByUserId(value)
    {
        const result = StoreModel.findBy({userId: value.userId});
        if (result)
            return result;
        else
            return {
                error: "Error with the getting Stores by user id"
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