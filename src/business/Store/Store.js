const StoreModel = require('../../models/model/Store');

module.exports =  class Store {
    constructor() {}

    getStoreById(storeId)
    {
        const storePromise = StoreModel.findStoreById({storeId:storeId});
        return storePromise;
    }

    getAllStores()
    {
        const storePromise = StoreModel.findAllStores();
        return storePromise;
    }

    getStoreByUserId(userId)
    {
        const storePromise = StoreModel.findStores({userId:userId});
        return storePromise;
    }

    deleteStoreByUserId(userId)
    {
        const storePromise = StoreModel.deleteStoreByUserId({userId:userId});
        return storePromise;
    }

}
