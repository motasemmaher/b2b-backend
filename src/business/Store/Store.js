const StoreModel = require('../../models/model/Store');
const StoreValidation = require('./validate');
module.exports = class Store {
    constructor() {}

    validateStoreInfo(storeInfo) {
        const validationResult = StoreValidation.validateStoreInfo(storeInfo);
        if (validationResult !== "pass")
            return {
                err: "Error: " + validationResult
            };
    }

    exists(storeId) {
        const promiseResult = StoreModel.exists({
            storeId: storeId
        });
        return promiseResult;
    }

    countAll() {
        const promiseResult = StoreModel.countAll();
        return promiseResult;
    }

    countByGarageOwner(userId) {
        const promiseResult = StoreModel.countByGarageOwner({
            userId: userId
        });
        return promiseResult;
    }

    countBySameAddress(address)
    {
        const promiseResult = StoreModel.countBySameAddress({address:address});
        return promiseResult;
    }

    createStore(storeInfo)
    {
        const promiseResult = StoreModel.createStore(storeInfo);
        return promiseResult;
    }

    updateStore(storeInfo) {
        const promiseResult = StoreModel.updateStore(storeInfo);
        return promiseResult;
    }


    deleteStore(storeId) {
        const promiseResult = StoreModel.deleteStore({
            _id: storeId
        });
        return promiseResult;
    }

    getStoreById(storeId) {
        const promiseResult = StoreModel.findStoreById({
            storeId: storeId
        });
        return promiseResult;
    }

    getAllStores(limit,skip)
    {
        const promiseResult = StoreModel.findFullStores({limit:limit,skip:skip});
        return promiseResult;
    }

    getStoresByUserId(userId) {
        const promiseResult = StoreModel.findStores({
            userId: userId
        });
        return promiseResult;
    }

    getFullStoresByUserId(userId, limit, skip) {
        const promiseResult = StoreModel.findStoresByUserId({
            userId: userId,
            limit: limit,
            skip: skip
        });
        return promiseResult;
    }

    getSameAddressStores(address,limit,skip)
    {
        const promiseResult = StoreModel.findSameAddressStores({address:address,limit:limit,skip:skip});
        return promiseResult;
    }
    
    deleteStoreByUserId(userId)
    {
        const promiseResult = StoreModel.deleteStoreByUserId({userId:userId});
        return promiseResult;
    }

    // added by thaer
    getStore(storeId) {
        const result = StoreModel.getStore({
            _id: storeId
        });
        return result;
    }

    deleteAllStore() {
        const result = StoreModel.deleteAllStore();
        return result;
    }

    updateOrderStatus(storeId, orderId, status) {
        const result = StoreModel.updateOrderStatus({
            _id: storeId,
            orderId: orderId,
            status: status
        });
        return result;
    }

    addOrder(storeId, orderId) {
        const result = StoreModel.addOrder({
            _id: storeId,
            orderId: orderId
        });
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
            _id: storeId,
            orderId: orderId
        });

        return result;
    }

    searchStores(searchText, limit, skip) {
        const result = StoreModel.searchStores({
            searchText: searchText,
            limit: limit,
            skip: skip
        });
        return result;
    }
}