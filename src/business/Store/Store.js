const StoreModel = require('../../models/model/Store');

module.exports = class Store {

    deleteStoreByUserId(userId)
    {
        const promiseResult = StoreModel.deleteStoreByUserId({userId:userId});
        return promiseResult;
    }
    getStoreByUserId(userId)
    {
        const promiseResult = StoreModel.findStores({userId:userId});
        return promiseResult;
    }

    getAllStores()
    {
        const promiseResult = StoreModel.findAllStores();
        return promiseResult;
    }
    getStoreById(storeId)
    {
        const promiseResult = StoreModel.findStoreById({storeId:storeId});
        return promiseResult;
    }
    validateStoreInfo(storeInfo)
    {
        const validationResult = StoreValidation.validateStoreInfo(storeInfo);
        if(validationResult !== "pass")
            return {err:"Error: "+validationResult};
    }

    constructor (Store)
    {}

    createStore(storeInfo) {
        const result = StoreModel.createStore(storeInfo);        
        return result;
    }

    updateStore(updatedStore) {
        const result = StoreModel.updateStore(updatedStore);
        return result;
    }

    deleteStore(storeId) {
        const result = StoreModel.deleteStore(storeId);
        return result;
    }

    getStore(storeId) {
        const result = StoreModel.getStore({_id: storeId});
        return result;
    }

    deleteAllStore() {
        const result = StoreModel.deleteAllStore();
        return result;
    }

    updateOrderStatus(storeId, orderId, status) {
        const result = StoreModel.updateOrderStatus({_id: storeId, orderId: orderId, status: status});
        return result;
    }

    addOrder(storeId, orderId) {
        const result = StoreModel.addOrder({_id: storeId, orderId: orderId});
        return result;
    }

    getStoresAssociatedWithGarageOwner(garageOwnerId) {
        const result = StoreModel.getStoresAssociatedWithGarageOwner({
            garageOwnerId: garageOwnerId
        });
        return result;
    }

    getOrderFromeStore(storeId, orderId) {
        const result = StoreModel.getOrderFromeStore({
            _id: storeId, orderId: orderId
        });
        
        return result;
    }
}
