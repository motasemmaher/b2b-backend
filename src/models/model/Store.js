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
        const result = StoreModel.findByIdAndUpdate({
            _id: value._id
        }, Store);

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

    deleteAllStore() {
        const result = StoreModel.deleteMany({});

        if (result)
            return result;
        else
            return {
                error: "Error with the delete all Stores"
            };
    }
};