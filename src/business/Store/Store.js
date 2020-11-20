const StoreModel = require('../../models/model/Store');

module.exports = class Store {
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