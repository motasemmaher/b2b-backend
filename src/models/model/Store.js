const mongoose = require('mongoose');
const StoreSchema = require("../schema/Store");
const StoreModel= mongoose.model('Store', StoreSchema);

module.exports = {
    
    exists(value)
    {
        const result = StoreModel.findById({_id: value.storeId},{id:1,userId:1});
        if (result)
            return result;
        else
            return {error: "Error with the getting Store"};
    },

    countAll()
    {
        const count = StoreModel.countDocuments({});
        return count;
    },

    countByGarageOwner(value)
    {
        const count = StoreModel.countDocuments({ userId: value.userId });
        return count;
    },

    countBySameAddress(value)
    {
        const count = StoreModel.countDocuments({ address: value.address });
        return count;
    },

    createStore(value) {
        tags = value.tags.split(',');
        value = {...value,tags:tags};
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
        tags = value.tags.split(',');
        value = {...value,tags:tags};
        const result = StoreModel.findByIdAndUpdate(
            {_id: value._id},
            value,
            {"useFindAndModify":false}
            );

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

    findFullStores(limit,skip)
    {
        const result = StoreModel.find({}).select('name , address , image , openTime , closeTime').skip(skip).limit(limit)//.pretty();
        if (result) 
            return result;
        else 
            return {error: "Error with the finding all Stores"};
    },

    findSameAddressStores(value,limit,skip)
    {
        const result = StoreModel.find({address:value.address}).select('name , address , image , openTime , closeTime').skip(skip).limit(limit)//.pretty();
        if (result) 
            return result;
        else 
            return {error: "Error with the finding same address Stores"};
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

    findStoresByUserId(value)
    {
        const result = StoreModel.find({userId: value.userId}).skip(value.skip).limit(value.limit);
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