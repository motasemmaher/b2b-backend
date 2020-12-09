const StoreModel = require('../../models/model/Store');
const StoreValidation = require('./validate');

module.exports =  class Store {
    constructor() {}

    validateStoreInfo(storeInfo)
    {
        const validationResult = StoreValidation.validateStoreInfo(storeInfo);
        if(validationResult !== "pass")
            return {err:"Error: "+validationResult};
    }

    createStore(storeInfo)
    {
        const promiseResult = StoreModel.createStore(storeInfo);
        return promiseResult;
    }

    updateStore(storeInfo)
    {
        const promiseResult = StoreModel.updateStore(storeInfo);
        return promiseResult;
    }


    deleteStore(storeId)
    {
        const promiseResult = StoreModel.deleteStore({_id:storeId});
        return promiseResult;
    }

    getStoreById(storeId)
    {
        const promiseResult = StoreModel.findStoreById({storeId:storeId});
        return promiseResult;
    }

    getAllStores(limit,skip)
    {
        const promiseResult = StoreModel.findFullStores(limit,skip);
        return promiseResult;
    }

    getStoresByUserId(userId)
    {
        const promiseResult = StoreModel.findStores({userId:userId});
        return promiseResult;
    }

    getFullStoresByUserId(userId)
    {
        const promiseResult = StoreModel.findStoreByUserId({userId:userId});
        return promiseResult;
    }

    deleteStoreByUserId(userId)
    {
        const promiseResult = StoreModel.deleteStoreByUserId({userId:userId});
        return promiseResult;
    }

}
